import assert from "node:assert/strict";
import {
  verifyLinkTarget,
  type LinkCheckFetch,
} from "./affiliate-link-checker";

function response(status: number, location?: string) {
  return new Response("", {
    status,
    headers: location ? { location } : undefined,
  });
}

async function main() {
  const redirects: LinkCheckFetch = async (url) => {
    if (url === "https://go.example.com/start") return response(302, "https://partner.example.com/next");
    if (url === "https://partner.example.com/next") return response(200);
    throw new Error(`Unexpected URL ${url}`);
  };

  const ok = await verifyLinkTarget("https://go.example.com/start", {
    fetchImpl: redirects,
    maxRedirects: 4,
    now: () => 1000,
    monotonicNow: (() => {
      let t = 0;
      return () => {
        t += 25;
        return t;
      };
    })(),
  });

  assert.equal(ok.ok, true);
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.finalUrl, "https://partner.example.com/next");
  assert.deepEqual(ok.redirectChain, ["https://go.example.com/start", "https://partner.example.com/next"]);
  assert.equal(ok.latencyMs, 25);

  const loop: LinkCheckFetch = async (url) => {
    if (url === "https://loop.example.com/a") return response(302, "https://loop.example.com/b");
    return response(302, "https://loop.example.com/a");
  };

  const tooMany = await verifyLinkTarget("https://loop.example.com/a", {
    fetchImpl: loop,
    maxRedirects: 1,
  });

  assert.equal(tooMany.ok, false);
  assert.equal(tooMany.error, "too_many_redirects");

  const unsafe = await verifyLinkTarget("javascript:alert(1)", { fetchImpl: redirects });
  assert.equal(unsafe.ok, false);
  assert.equal(unsafe.error, "invalid_url");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
