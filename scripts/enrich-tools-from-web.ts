import Anthropic from "@anthropic-ai/sdk";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import * as fs from "node:fs";
import { isIP } from "node:net";
import * as path from "node:path";
import {
  buildEnrichmentBackupPayload,
  buildToolUpdatePayload,
  classifyToolFromMiniSummary,
  extractJsonObject,
  hasMinimumEvidence,
  normalizeEnrichmentResult,
  validateEnrichmentResult,
  type EnrichmentEvidencePage,
  type EnrichmentProvider,
  type EvidenceSourceType,
  type NormalizedEnrichmentResult,
} from "../src/lib/tool-enrichment";
import { OUTCOME_TAXONOMY } from "../src/lib/outcome-taxonomy";
import { validateOutcomeProposal, type OutcomeMigrationProposal } from "../src/lib/outcome-migration";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

loadEnv();

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const DRY_RUN = args.includes("--dry-run") || !APPLY;
const ALL_FLAG = args.includes("--all");
const QUIET = args.includes("--quiet");
const APPLY_TAXONOMY = args.includes("--apply-taxonomy");
const slugsArg = args.find((arg) => arg.startsWith("--slugs="));
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const providerArg = args.find((arg) => arg.startsWith("--provider="));
const minPagesArg = args.find((arg) => arg.startsWith("--min-pages="));
const outputArg = args.find((arg) => arg.startsWith("--output="));

const SLUGS = slugsArg
  ? slugsArg.split("=")[1].split(",").map((slug) => slug.trim()).filter(Boolean)
  : null;
const LIMIT = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : Number.POSITIVE_INFINITY;
const MIN_PAGES = minPagesArg ? Number.parseInt(minPagesArg.split("=")[1], 10) : 3;
const PRIMARY_PROVIDER = (providerArg?.split("=")[1] || "firecrawl") as EnrichmentProvider;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const OUTPUT_FILE = outputArg ? path.resolve(process.cwd(), outputArg.split("=")[1]) : null;

if (!SLUGS && !ALL_FLAG) {
  console.error("Pass --slugs=a,b,c or --all.");
  process.exit(1);
}

if (!Number.isFinite(MIN_PAGES) || MIN_PAGES < 1) {
  console.error("--min-pages must be a positive integer.");
  process.exit(1);
}

interface ToolRow {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  short_description: string | null;
  full_description: string | null;
  enrichment_summary?: string | null;
  pricing_summary: string | null;
  best_for: string | null;
  logo_url: string | null;
  has_free_plan: boolean | null;
  gdpr_compliant: boolean | null;
  founded_year: number | null;
  employee_count: string | null;
  community_reputation: number | null;
  has_api: boolean | null;
  has_mobile_app: boolean | null;
  soc2_certified: boolean | null;
  trial_days: number | null;
  company_hq: string | null;
  integrations: string[] | null;
  support_languages: string[] | null;
  ui_languages: string[] | null;
  min_monthly_price: number | null;
  max_monthly_price: number | null;
}

interface CrawlCandidate {
  url: string;
  sourceType: EvidenceSourceType;
}

interface CrawlResult {
  provider: EnrichmentProvider;
  url: string;
  statusCode?: number;
  title?: string | null;
  markdown: string;
}

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase service configuration");
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
  return new Anthropic({ apiKey });
}

function hashContent(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function excerpt(value: string, maxLen = 700) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
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

function privateIp(ip: string) {
  const family = isIP(ip);
  if (family === 4) return privateIpv4(ip);
  if (family === 6) return privateIpv6(ip);
  return true;
}

async function assertSafeRemoteUrl(rawUrl: string) {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error(`Unsafe protocol: ${parsed.protocol}`);
  if (parsed.username || parsed.password) throw new Error("Refusing URL with credentials");
  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error(`Private hostname: ${parsed.hostname}`);
  }
  if (isIP(host) && privateIp(host)) throw new Error(`Private IP: ${host}`);
  if (!isIP(host)) {
    const resolved = await lookup(host, { all: true });
    if (!resolved.length) throw new Error(`Cannot resolve: ${host}`);
    for (const entry of resolved) {
      if (privateIp(entry.address)) throw new Error(`Resolves to private IP: ${host}`);
    }
  }
  return parsed;
}

function normalizeWebsiteUrl(rawUrl: string) {
  const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}

function htmlToText(html: string) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCandidateUrls(websiteUrl: string): CrawlCandidate[] {
  const base = normalizeWebsiteUrl(websiteUrl);
  return [
    { url: base, sourceType: "homepage" },
    { url: `${base}/pricing`, sourceType: "pricing" },
    { url: `${base}/plans`, sourceType: "pricing" },
    { url: `${base}/features`, sourceType: "features" },
    { url: `${base}/product`, sourceType: "features" },
    { url: `${base}/integrations`, sourceType: "integrations" },
    { url: `${base}/security`, sourceType: "security" },
    { url: `${base}/docs`, sourceType: "docs" },
    { url: `${base}/documentation`, sourceType: "docs" },
    { url: `${base}/changelog`, sourceType: "changelog" },
    { url: `${base}/blog`, sourceType: "blog" },
    { url: `${base}/about`, sourceType: "about" },
    { url: `${base}/company`, sourceType: "about" },
    { url: `${base}/about-us`, sourceType: "about" },
  ];
}

async function scrapeWithFirecrawl(url: string): Promise<CrawlResult | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return null;
  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      timeout: 15000,
      removeBase64Images: true,
    }),
  });
  if (!response.ok) return null;
  const parsed = await response.json() as {
    success?: boolean;
    data?: {
      markdown?: string;
      metadata?: { title?: string; statusCode?: number; sourceURL?: string };
    };
  };
  const markdown = parsed.data?.markdown?.trim();
  if (!parsed.success || !markdown) return null;
  return {
    provider: "firecrawl",
    url: parsed.data?.metadata?.sourceURL || url,
    statusCode: parsed.data?.metadata?.statusCode || response.status,
    title: parsed.data?.metadata?.title,
    markdown,
  };
}

async function scrapeWithCloudflare(url: string): Promise<CrawlResult | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) return null;
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/markdown`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) return null;
  const parsed = await response.json() as { result?: string | { markdown?: string }; success?: boolean };
  const markdown = typeof parsed.result === "string" ? parsed.result : parsed.result?.markdown;
  if (!markdown?.trim()) return null;
  return { provider: "cloudflare", url, statusCode: response.status, markdown: markdown.trim() };
}

async function scrapeWithLocalFetch(url: string): Promise<CrawlResult | null> {
  let currentUrl = await assertSafeRemoteUrl(url);
  for (let redirects = 0; redirects < 4; redirects += 1) {
    const response = await fetch(currentUrl.toString(), {
      redirect: "manual",
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyAIMatch-Enrichment/1.0; +https://myaimatch.ai)",
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      currentUrl = await assertSafeRemoteUrl(new URL(location, currentUrl).toString());
      continue;
    }
    if (!response.ok) return null;
    const html = await response.text();
    const markdown = htmlToText(html);
    return { provider: "local-fetch", url: currentUrl.toString(), statusCode: response.status, markdown };
  }
  return null;
}

async function scrapeUrl(url: string, primaryProvider: EnrichmentProvider): Promise<CrawlResult | null> {
  await assertSafeRemoteUrl(url);
  const providers: Array<() => Promise<CrawlResult | null>> = [];
  if (primaryProvider === "firecrawl") providers.push(() => scrapeWithFirecrawl(url));
  if (primaryProvider === "cloudflare") providers.push(() => scrapeWithCloudflare(url));
  providers.push(() => scrapeWithFirecrawl(url));
  providers.push(() => scrapeWithCloudflare(url));
  providers.push(() => scrapeWithLocalFetch(url));

  const seen = new Set<string>();
  for (const provider of providers) {
    const name = provider.toString();
    if (seen.has(name)) continue;
    seen.add(name);
    try {
      const result = await provider();
      if (result?.markdown && excerpt(result.markdown).length >= 40) return result;
    } catch {
      // Try the next provider.
    }
  }
  return null;
}

async function crawlToolPages(tool: Pick<ToolRow, "website_url">, minPages: number, provider: EnrichmentProvider) {
  const evidence: EnrichmentEvidencePage[] = [];
  const seenUrls = new Set<string>();
  const seenHashes = new Set<string>();
  const candidates = buildCandidateUrls(tool.website_url);
  const targetPages = Math.max(minPages, 5);

  for (const candidate of candidates) {
    if (seenUrls.has(candidate.url)) continue;
    seenUrls.add(candidate.url);
    const scraped = await scrapeUrl(candidate.url, provider);
    if (!scraped) continue;

    const contentHash = hashContent(scraped.markdown);
    if (seenHashes.has(contentHash)) continue;
    seenHashes.add(contentHash);

    evidence.push({
      url: scraped.url,
      provider: scraped.provider,
      sourceType: candidate.sourceType,
      fetchedAt: new Date().toISOString(),
      contentHash,
      statusCode: scraped.statusCode,
      title: scraped.title,
      excerpt: excerpt(scraped.markdown),
      markdown: scraped.markdown.slice(0, 12000),
    });

    if (evidence.length >= targetPages && hasMinimumEvidence(evidence, minPages)) break;
  }

  return evidence;
}

function buildExtractionPrompt(tool: ToolRow, evidencePages: EnrichmentEvidencePage[]) {
  const evidenceText = evidencePages
    .map((page, index) => [
      `--- SOURCE ${index + 1}: ${page.sourceType.toUpperCase()} ---`,
      `URL: ${page.url}`,
      page.markdown.slice(0, 5000),
    ].join("\n"))
    .join("\n\n");

  return `You are enriching an AI tools directory from current first-party website evidence.

Tool name: ${tool.name}
Website: ${tool.website_url}

Use ONLY the evidence below. If a field is not supported by evidence, return null.

${evidenceText}

Return ONLY valid JSON with this shape:
{
  "mini_summary": "80-140 words. Plain English. What the business does, who it is for, key current capabilities.",
  "full_description": "150-250 words. Clear product description grounded in the evidence.",
  "short_description": "One sentence under 120 characters.",
  "pricing_summary": "Concise pricing summary if present, otherwise null.",
  "best_for": "Solo | Small Team | Mid-Market | Enterprise | All",
  "has_free_plan": true,
  "gdpr_compliant": true,
  "founded_year": 2021,
  "employee_count": "1-10 | 11-50 | 51-200 | 200+",
  "community_reputation": null,
  "has_api": true,
  "has_mobile_app": false,
  "soc2_certified": true,
  "trial_days": 14,
  "company_hq": "USA | EU | UK | Canada | LATAM | Asia | Other",
  "integrations": ["Zapier", "Slack", "Make", "Google Workspace", "HubSpot", "Notion", "Stripe", "Other"],
  "support_languages": ["English"],
  "ui_languages": ["English"],
  "min_monthly_price": 0,
  "max_monthly_price": 99
}`;
}

async function extractEnrichment(
  anthropic: Anthropic,
  tool: ToolRow,
  evidencePages: EnrichmentEvidencePage[],
): Promise<NormalizedEnrichmentResult> {
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1800,
    messages: [{ role: "user", content: buildExtractionPrompt(tool, evidencePages) }],
  });
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Anthropic returned no text");
  const json = extractJsonObject(textBlock.text);
  if (!json) throw new Error("Anthropic returned no JSON object");
  return normalizeEnrichmentResult(JSON.parse(json));
}

function taxonomyPromptText() {
  return OUTCOME_TAXONOMY.map((outcome) => {
    const subcategories = outcome.subcategories.map((subcategory) => subcategory.slug).join(", ");
    return `- ${outcome.slug}: ${outcome.description} Subcategories: ${subcategories}`;
  }).join("\n");
}

function normalizeClassificationJson(
  raw: unknown,
  tool: ToolRow,
  fallbackReason = "LLM taxonomy classifier",
): OutcomeMigrationProposal | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const primaryOutcomeSlug = typeof value.primaryOutcomeSlug === "string" ? value.primaryOutcomeSlug : "";
  const secondaryOutcomeSlugs = Array.isArray(value.secondaryOutcomeSlugs)
    ? value.secondaryOutcomeSlugs.filter((item): item is string => typeof item === "string")
    : [];
  const subcategorySlugs = Array.isArray(value.subcategorySlugs)
    ? value.subcategorySlugs.filter((item): item is string => typeof item === "string")
    : [];
  const confidence = value.confidence === "high" || value.confidence === "medium" || value.confidence === "low"
    ? value.confidence
    : "medium";
  const reason = typeof value.reason === "string" && value.reason.trim()
    ? value.reason.trim()
    : fallbackReason;

  const proposal: OutcomeMigrationProposal = {
    toolId: tool.id,
    toolName: tool.name,
    toolSlug: tool.slug,
    primaryOutcomeSlug,
    secondaryOutcomeSlugs,
    subcategorySlugs,
    confidence,
    reason,
  };

  return validateOutcomeProposal(proposal).valid ? proposal : null;
}

async function classifyWithClaude(
  anthropic: Anthropic,
  tool: ToolRow,
  miniSummary: string,
): Promise<OutcomeMigrationProposal> {
  const prompt = `Classify this AI tool into the approved myAImatch taxonomy.

Use ONLY this mini summary. Do not use outside knowledge.

Tool name: ${tool.name}
Mini summary: ${miniSummary}

Taxonomy:
${taxonomyPromptText()}

Return ONLY valid JSON:
{
  "primaryOutcomeSlug": "one taxonomy outcome slug",
  "secondaryOutcomeSlugs": ["0-2 secondary outcome slugs"],
  "subcategorySlugs": ["1-3 exact subcategory slugs"],
  "confidence": "high | medium | low",
  "reason": "one sentence grounded in the mini summary"
}

Rules:
- Pick the user's main job-to-be-done, not every feature mentioned.
- If a product builds/deploys AI agents, voice agents, chatbots, copilots, or assistants, prefer build-ai-agents over automate-workflows.
- If a product connects apps with deterministic triggers/actions, prefer automate-workflows.
- If a product helps marketers discover search demand, keywords, audience questions, trends, SEO opportunities, or content ideas, prefer grow-audience over analyze-data.
- Use analyze-data only when the primary product is BI, dashboards, forecasting, analytics, spreadsheets, or document/data Q&A.
- Subcategory slugs must exactly match the taxonomy list.`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("Anthropic returned no text");
    const json = extractJsonObject(textBlock.text);
    if (!json) throw new Error("Anthropic returned no JSON object");
    const proposal = normalizeClassificationJson(JSON.parse(json), tool);
    if (proposal) return proposal;
  } catch {
    // Fall back to deterministic classifier below.
  }

  return classifyToolFromMiniSummary({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    miniSummary,
  });
}

function toolSelectColumns(includeEnrichmentSummary: boolean) {
  return [
    "id",
    "name",
    "slug",
    "website_url",
    "short_description",
    "full_description",
    ...(includeEnrichmentSummary ? ["enrichment_summary"] : []),
    "pricing_summary",
    "best_for",
    "logo_url",
    "has_free_plan",
    "gdpr_compliant",
    "founded_year",
    "employee_count",
    "community_reputation",
    "has_api",
    "has_mobile_app",
    "soc2_certified",
    "trial_days",
    "company_hq",
    "integrations",
    "support_languages",
    "ui_languages",
    "min_monthly_price",
    "max_monthly_price",
  ].join(", ");
}

async function readTools(supabase: SupabaseClient, includeEnrichmentSummary = true): Promise<ToolRow[]> {
  let query = supabase
    .from("tools")
    .select(toolSelectColumns(includeEnrichmentSummary))
    .eq("status", "active")
    .order("name", { ascending: true });

  if (SLUGS?.length) query = query.in("slug", SLUGS);

  const { data, error } = await query;
  if (error) {
    if (
      includeEnrichmentSummary &&
      DRY_RUN &&
      error.message.includes("enrichment_summary")
    ) {
      console.warn("tools.enrichment_summary is missing; retrying dry-run without the new migration column.");
      return readTools(supabase, false);
    }
    throw new Error(`Tool read failed: ${error.message}`);
  }

  const rows = (data ?? []) as unknown as ToolRow[];
  return rows
    .filter((tool) => tool.id && tool.name && tool.slug && tool.website_url)
    .slice(0, LIMIT === Number.POSITIVE_INFINITY ? rows.length : LIMIT);
}

async function readTaxonomyMaps(supabase: SupabaseClient) {
  const [outcomes, subcategories] = await Promise.all([
    supabase.from("outcomes").select("id, slug"),
    supabase.from("subcategories").select("id, slug, outcome_id"),
  ]);
  if (outcomes.error) throw new Error(`Outcomes read failed: ${outcomes.error.message}`);
  if (subcategories.error) throw new Error(`Subcategories read failed: ${subcategories.error.message}`);

  return {
    outcomesBySlug: new Map(((outcomes.data ?? []) as Array<{ id: string; slug: string }>).map((row) => [row.slug, row])),
    subcategoriesBySlug: new Map(((subcategories.data ?? []) as Array<{ id: string; slug: string; outcome_id: string }>).map((row) => [row.slug, row])),
  };
}

async function createRun(supabase: SupabaseClient, tools: ToolRow[]) {
  const backup = buildEnrichmentBackupPayload({
    runId: "pending",
    createdAt: new Date().toISOString(),
    tools: tools.map((tool) => ({ ...tool })),
  });
  const { data, error } = await supabase
    .from("tool_enrichment_runs")
    .insert({
      provider: PRIMARY_PROVIDER,
      min_pages: MIN_PAGES,
      requested_slugs: SLUGS ?? [],
      total_tools: tools.length,
      backup_json: backup,
    })
    .select("id, created_at")
    .single();

  if (error) throw new Error(`Run insert failed: ${error.message}`);

  const runId = (data as { id: string }).id;
  const backupWithRunId = { ...backup, runId };
  await supabase.from("tool_enrichment_runs").update({ backup_json: backupWithRunId }).eq("id", runId);

  const backupDir = path.resolve(process.cwd(), "data", "enrichment-backups");
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, `${runId}.json`), `${JSON.stringify(backupWithRunId, null, 2)}\n`);

  return runId;
}

async function saveEvidence(supabase: SupabaseClient, runId: string, toolId: string, evidencePages: EnrichmentEvidencePage[]) {
  if (!evidencePages.length) return;
  const { error } = await supabase.from("tool_enrichment_evidence").insert(
    evidencePages.map((page) => ({
      run_id: runId,
      tool_id: toolId,
      url: page.url,
      provider: page.provider,
      source_type: page.sourceType,
      status_code: page.statusCode,
      content_hash: page.contentHash,
      title: page.title,
      excerpt: page.excerpt,
      fetched_at: page.fetchedAt,
    })),
  );
  if (error) throw new Error(`Evidence insert failed: ${error.message}`);
}

async function upsertUpdateSources(supabase: SupabaseClient, toolId: string, evidencePages: EnrichmentEvidencePage[]) {
  const rows = evidencePages.map((page) => ({
    tool_id: toolId,
    source_url: page.url,
    source_type: page.sourceType,
    provider: page.provider,
    status: "active",
    last_checked_at: page.fetchedAt,
    last_content_hash: page.contentHash,
  }));
  if (!rows.length) return;
  const { error } = await supabase
    .from("tool_update_sources")
    .upsert(rows, { onConflict: "tool_id,source_url" });
  if (error) throw new Error(`Update source upsert failed: ${error.message}`);
}

async function applyEnrichment(
  supabase: SupabaseClient,
  tool: ToolRow,
  normalized: NormalizedEnrichmentResult,
  classification: OutcomeMigrationProposal,
  evidencePages: EnrichmentEvidencePage[],
  maps: Awaited<ReturnType<typeof readTaxonomyMaps>>,
) {
  const primary = maps.outcomesBySlug.get(classification.primaryOutcomeSlug);
  if (!primary) throw new Error(`Unknown primary outcome: ${classification.primaryOutcomeSlug}`);

  const secondary = classification.secondaryOutcomeSlugs
    .filter((slug) => slug !== classification.primaryOutcomeSlug)
    .map((slug) => {
      const row = maps.outcomesBySlug.get(slug);
      if (!row) throw new Error(`Unknown secondary outcome: ${slug}`);
      return row;
    });

  const subcategories = classification.subcategorySlugs.map((slug) => {
    const row = maps.subcategoriesBySlug.get(slug);
    if (!row) throw new Error(`Unknown subcategory: ${slug}`);
    return row;
  });

  const update = buildToolUpdatePayload(normalized);
  update.enrichment_metadata = {
    evidence_urls: evidencePages.map((page) => page.url),
    evidence_hashes: evidencePages.map((page) => page.contentHash),
    classifier: "mini_summary_taxonomy_v1",
    primary_outcome_slug: classification.primaryOutcomeSlug,
    secondary_outcome_slugs: classification.secondaryOutcomeSlugs,
    subcategory_slugs: classification.subcategorySlugs,
    confidence: classification.confidence,
    reason: classification.reason,
  };

  const { error: toolError } = await supabase.from("tools").update(update).eq("id", tool.id);
  if (toolError) throw new Error(`Tool update failed: ${toolError.message}`);

  if (!APPLY_TAXONOMY) return;

  const { error: deleteSubcategoriesError } = await supabase.from("tool_subcategories").delete().eq("tool_id", tool.id);
  if (deleteSubcategoriesError) throw new Error(`Delete tool_subcategories failed: ${deleteSubcategoriesError.message}`);

  const { error: deleteOutcomesError } = await supabase.from("tool_outcomes").delete().eq("tool_id", tool.id);
  if (deleteOutcomesError) throw new Error(`Delete tool_outcomes failed: ${deleteOutcomesError.message}`);

  const { error: outcomeError } = await supabase.from("tool_outcomes").insert([
    { tool_id: tool.id, outcome_id: primary.id, is_primary: true },
    ...secondary.map((row) => ({ tool_id: tool.id, outcome_id: row.id, is_primary: false })),
  ]);
  if (outcomeError) throw new Error(`Insert tool_outcomes failed: ${outcomeError.message}`);

  const { error: subcategoryError } = await supabase.from("tool_subcategories").insert(
    subcategories.map((row) => ({ tool_id: tool.id, subcategory_id: row.id })),
  );
  if (subcategoryError) throw new Error(`Insert tool_subcategories failed: ${subcategoryError.message}`);
}

async function markRunComplete(
  supabase: SupabaseClient,
  runId: string | null,
  counts: { applied: number; skipped: number; failed: number },
  errorMessage?: string,
) {
  if (!runId) return;
  const status = errorMessage
    ? "failed"
    : counts.failed > 0 || counts.skipped > 0
      ? "completed_with_errors"
      : "completed";
  await supabase.from("tool_enrichment_runs").update({
    status,
    applied_tools: counts.applied,
    skipped_tools: counts.skipped,
    failed_tools: counts.failed,
    error_message: errorMessage,
    completed_at: new Date().toISOString(),
  }).eq("id", runId);
}

function writeOutputRecord(record: Record<string, unknown>) {
  if (!OUTPUT_FILE) return;
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.appendFileSync(OUTPUT_FILE, `${JSON.stringify(record)}\n`);
}

async function main() {
  console.log("AI tool web enrichment");
  console.log(`Mode: ${DRY_RUN ? "dry-run" : "apply"}`);
  console.log(`Provider: ${PRIMARY_PROVIDER}`);
  console.log(`Min pages: ${MIN_PAGES}`);
  console.log(`Apply taxonomy: ${APPLY_TAXONOMY}`);
  console.log(`Slugs: ${SLUGS?.join(", ") || "ALL"}`);
  if (OUTPUT_FILE) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, "");
    console.log(`Output: ${OUTPUT_FILE}`);
  }

  const supabase = getSupabase();
  const anthropic = getAnthropic();
  const tools = await readTools(supabase);
  const maps = await readTaxonomyMaps(supabase);
  const runId = DRY_RUN ? null : await createRun(supabase, tools);
  const counts = { applied: 0, skipped: 0, failed: 0 };

  try {
    for (let index = 0; index < tools.length; index += 1) {
      const tool = tools[index];
      process.stdout.write(`[${index + 1}/${tools.length}] ${tool.name} (${tool.slug}) ... `);

      try {
        const evidencePages = await crawlToolPages(tool, MIN_PAGES, PRIMARY_PROVIDER);
        if (!hasMinimumEvidence(evidencePages, MIN_PAGES)) {
          counts.skipped += 1;
          writeOutputRecord({
            status: "skipped",
            reason: "insufficient_evidence",
            tool_id: tool.id,
            tool_slug: tool.slug,
            tool_name: tool.name,
            evidence_page_count: evidencePages.length,
            evidence_urls: evidencePages.map((page) => page.url),
          });
          console.log(`skipped: ${evidencePages.length} evidence pages`);
          continue;
        }

        const normalized = await extractEnrichment(anthropic, tool, evidencePages);
        if (!normalized.mini_summary) {
          counts.skipped += 1;
          writeOutputRecord({
            status: "skipped",
            reason: "missing_mini_summary",
            tool_id: tool.id,
            tool_slug: tool.slug,
            tool_name: tool.name,
            evidence_page_count: evidencePages.length,
            evidence_urls: evidencePages.map((page) => page.url),
          });
          console.log("skipped: missing mini_summary");
          continue;
        }

        const classification = await classifyWithClaude(anthropic, tool, normalized.mini_summary);

        const validation = validateEnrichmentResult({
          toolName: tool.name,
          toolSlug: tool.slug,
          evidencePages,
          normalized,
          classification,
          minPages: MIN_PAGES,
        });

        if (!validation.valid) {
          counts.skipped += 1;
          writeOutputRecord({
            status: "skipped",
            reason: "validation_failed",
            errors: validation.errors,
            tool_id: tool.id,
            tool_slug: tool.slug,
            tool_name: tool.name,
            mini_summary: normalized.mini_summary,
            classification,
            evidence_page_count: evidencePages.length,
            evidence_urls: evidencePages.map((page) => page.url),
          });
          console.log(`skipped: ${validation.errors.join("; ")}`);
          continue;
        }

        if (DRY_RUN) {
          writeOutputRecord({
            status: "dry_run",
            tool_id: tool.id,
            tool_slug: tool.slug,
            tool_name: tool.name,
            normalized,
            classification,
            evidence_page_count: evidencePages.length,
            evidence_urls: evidencePages.map((page) => page.url),
          });
          console.log(`dry-run: ${classification.primaryOutcomeSlug} / ${classification.subcategorySlugs.join(", ")}`);
          if (!QUIET) {
            console.log(JSON.stringify({
              mini_summary: normalized.mini_summary,
              short_description: normalized.short_description,
              evidence_urls: evidencePages.map((page) => page.url),
            }, null, 2));
          }
          continue;
        }

        await saveEvidence(supabase, runId!, tool.id, evidencePages);
        await applyEnrichment(supabase, tool, normalized, classification, evidencePages, maps);
        await upsertUpdateSources(supabase, tool.id, evidencePages);
        counts.applied += 1;
        writeOutputRecord({
          status: "applied",
          tool_id: tool.id,
          tool_slug: tool.slug,
          tool_name: tool.name,
          classification,
          evidence_page_count: evidencePages.length,
          evidence_urls: evidencePages.map((page) => page.url),
        });
        console.log(`applied: ${classification.primaryOutcomeSlug}`);
      } catch (error) {
        counts.failed += 1;
        writeOutputRecord({
          status: "failed",
          tool_id: tool.id,
          tool_slug: tool.slug,
          tool_name: tool.name,
          error: error instanceof Error ? error.message : String(error),
        });
        console.log(`failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    await markRunComplete(supabase, runId, counts);
  } catch (error) {
    await markRunComplete(supabase, runId, counts, error instanceof Error ? error.message : String(error));
    throw error;
  }

  console.log(`Done. Applied: ${counts.applied}. Skipped: ${counts.skipped}. Failed: ${counts.failed}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
