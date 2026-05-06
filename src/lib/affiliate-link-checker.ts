import { isIP } from "node:net";

export type LinkCheckFetch = (url: string, init?: RequestInit) => Promise<Response>;

export interface LinkCheckOptions {
  fetchImpl?: LinkCheckFetch;
  maxRedirects?: number;
  timeoutMs?: number;
  now?: () => number;
  monotonicNow?: () => number;
}

export interface LinkCheckResult {
  ok: boolean;
  checkedAt: string;
  inputUrl: string;
  finalUrl: string | null;
  statusCode: number | null;
  redirectChain: string[];
  latencyMs: number | null;
  error: string | null;
}

function privateIpv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function privateIpv6(ip: string) {
  const normalized = ip.toLowerCase();
  return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

function isUnsafeHostname(hostname: string) {
  const normalized = hostname.toLowerCase();
  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  ) {
    return true;
  }

  const family = isIP(normalized);
  if (family === 4) return privateIpv4(normalized);
  if (family === 6) return privateIpv6(normalized);
  return false;
}

function parsePublicHttpUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (isUnsafeHostname(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function redirectLocation(response: Response, currentUrl: URL) {
  if (response.status < 300 || response.status >= 400) return null;
  const location = response.headers.get("location");
  if (!location) return null;
  return parsePublicHttpUrl(new URL(location, currentUrl).toString());
}

export async function verifyLinkTarget(rawUrl: string, options: LinkCheckOptions = {}): Promise<LinkCheckResult> {
  const started = options.monotonicNow?.() ?? Date.now();
  const checkedAt = new Date(options.now?.() ?? Date.now()).toISOString();
  const maxRedirects = options.maxRedirects ?? 5;
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 12000;
  const firstUrl = parsePublicHttpUrl(rawUrl);

  if (!firstUrl) {
    return {
      ok: false,
      checkedAt,
      inputUrl: rawUrl,
      finalUrl: null,
      statusCode: null,
      redirectChain: [],
      latencyMs: null,
      error: "invalid_url",
    };
  }

  let currentUrl = firstUrl;
  const redirectChain = [currentUrl.toString()];

  for (let redirects = 0; redirects <= maxRedirects; redirects += 1) {
    try {
      const response = await fetchImpl(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MyAIMatch-LinkCheck/1.0; +https://myaimatch.ai)",
        },
      });

      const nextUrl = redirectLocation(response, currentUrl);
      if (nextUrl) {
        if (redirects >= maxRedirects) {
          return {
            ok: false,
            checkedAt,
            inputUrl: rawUrl,
            finalUrl: nextUrl.toString(),
            statusCode: response.status,
            redirectChain: [...redirectChain, nextUrl.toString()],
            latencyMs: null,
            error: "too_many_redirects",
          };
        }
        currentUrl = nextUrl;
        redirectChain.push(currentUrl.toString());
        continue;
      }

      const ended = options.monotonicNow?.() ?? Date.now();
      return {
        ok: response.status >= 200 && response.status < 400,
        checkedAt,
        inputUrl: rawUrl,
        finalUrl: currentUrl.toString(),
        statusCode: response.status,
        redirectChain,
        latencyMs: Math.max(0, Math.round(ended - started)),
        error: response.status >= 200 && response.status < 400 ? null : "bad_status",
      };
    } catch (error) {
      return {
        ok: false,
        checkedAt,
        inputUrl: rawUrl,
        finalUrl: currentUrl.toString(),
        statusCode: null,
        redirectChain,
        latencyMs: null,
        error: error instanceof Error ? error.name || "fetch_error" : "fetch_error",
      };
    }
  }

  return {
    ok: false,
    checkedAt,
    inputUrl: rawUrl,
    finalUrl: currentUrl.toString(),
    statusCode: null,
    redirectChain,
    latencyMs: null,
    error: "too_many_redirects",
  };
}
