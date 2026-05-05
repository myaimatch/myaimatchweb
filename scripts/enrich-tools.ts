import Anthropic from '@anthropic-ai/sdk'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { lookup } from 'dns/promises'
import * as fs from 'fs'
import { isIP } from 'net'
import * as path from 'path'

// ─── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}
loadEnv()

// ─── CLI Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const limitArg = args.find((a) => a.startsWith('--limit='))
const slugsArg = args.find((a) => a.startsWith('--slugs='))
const ALL_FLAG = args.includes('--all')
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity
const SLUGS = slugsArg
  ? slugsArg
      .split('=')[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null

console.log(`\n🔧 Enrich Tools Script`)
console.log(`   Dry run: ${DRY_RUN}`)
console.log(`   Slugs:   ${SLUGS ? SLUGS.join(', ') : ALL_FLAG ? 'ALL' : '(none — pass --slugs= or --all)'}`)
console.log(`   Limit:   ${LIMIT === Infinity ? 'all' : LIMIT}\n`)

if (!SLUGS && !ALL_FLAG) {
  console.error('❌ Pass --slugs=a,b,c or --all to run.')
  process.exit(1)
}

// ─── Clients ──────────────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing Supabase service configuration')
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ToolRecord {
  id: string
  name: string
  slug: string
  websiteUrl: string
}

interface EnrichedData {
  full_description: string | null
  short_description: string | null
  pricing_summary: string | null
  best_for: string | null
  has_free_plan: boolean | null
  gdpr_compliant: boolean | null
  founded_year: number | null
  employee_count: string | null
  community_reputation: number | null
  has_api: boolean | null
  has_mobile_app: boolean | null
  soc2_certified: boolean | null
  trial_days: number | null
  company_hq: string | null
  integrations: string[] | null
  support_languages: string[] | null
  ui_languages: string[] | null
}

const ALLOWED_BEST_FOR = new Set(['Solo', 'Small Team', 'Mid-Market', 'Enterprise', 'All'])
const ALLOWED_INTEGRATIONS = new Set([
  'Zapier',
  'Slack',
  'Make',
  'Google Workspace',
  'HubSpot',
  'Notion',
  'Stripe',
  'Other',
])
const ALLOWED_COMPANY_HQ = new Set(['USA', 'EU', 'UK', 'Canada', 'LATAM', 'Asia', 'Other'])
const ALLOWED_EMPLOYEE_COUNT = new Set(['1-10', '11-50', '51-200', '200+'])

// ─── Safe URL fetching ────────────────────────────────────────────────────────
function isPrivateHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase()
  return (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal')
  )
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return true
  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}

function isPrivateIpv6(ip: string): boolean {
  const n = ip.toLowerCase()
  return n === '::1' || n === '::' || n.startsWith('fc') || n.startsWith('fd') || n.startsWith('fe80:')
}

function isPrivateIpAddress(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return isPrivateIpv4(ip)
  if (family === 6) return isPrivateIpv6(ip)
  return true
}

async function assertSafeRemoteUrl(rawUrl: string): Promise<URL> {
  const url = new URL(rawUrl)
  if (url.protocol !== 'https:') throw new Error(`Unsafe protocol: ${url.protocol}`)
  if (url.username || url.password) throw new Error('Refusing URL with credentials')
  if (isPrivateHostname(url.hostname)) throw new Error(`Private hostname: ${url.hostname}`)
  if (isIP(url.hostname) && isPrivateIpAddress(url.hostname)) throw new Error(`Private IP: ${url.hostname}`)
  if (!isIP(url.hostname)) {
    const resolved = await lookup(url.hostname, { all: true })
    if (!resolved.length) throw new Error(`Cannot resolve: ${url.hostname}`)
    for (const entry of resolved) {
      if (isPrivateIpAddress(entry.address)) throw new Error(`Resolves to private IP: ${url.hostname}`)
    }
  }
  return url
}

async function fetchTextWithValidation(rawUrl: string, transform?: (html: string) => string): Promise<string> {
  let currentUrl: URL
  try {
    currentUrl = await assertSafeRemoteUrl(rawUrl)
  } catch {
    return ''
  }

  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(currentUrl, {
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyAIMatch/1.0; +https://myaimatch.ai)' },
        redirect: 'manual',
      })
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location')
        if (!location) return ''
        currentUrl = await assertSafeRemoteUrl(new URL(location, currentUrl).toString())
        continue
      }
      if (!res.ok) return ''
      const text = await res.text()
      return transform ? transform(text) : text
    } catch {
      return ''
    }
  }
  return ''
}

// ─── Normalizers ──────────────────────────────────────────────────────────────
function normalizeEnum(value: unknown, allowed: Set<string>): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  return allowed.has(v) ? v : null
}

function normalizeBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null
}

function normalizeNumber(value: unknown, opts: { min?: number; max?: number } = {}): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  if (opts.min != null && value < opts.min) return null
  if (opts.max != null && value > opts.max) return null
  return value
}

function normalizeString(value: unknown, maxLen = 5000): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  return v ? v.slice(0, maxLen) : null
}

function normalizeStringArray(value: unknown, allowed?: Set<string>): string[] | null {
  if (!Array.isArray(value)) return null
  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, idx, arr) => arr.indexOf(item) === idx)
    .filter((item) => !allowed || allowed.has(item))
  return cleaned.length ? cleaned : null
}

function sanitize(data: unknown): EnrichedData | null {
  if (!data || typeof data !== 'object') return null
  const c = data as Record<string, unknown>
  return {
    full_description: normalizeString(c.full_description, 5000),
    short_description: normalizeString(c.short_description, 200),
    pricing_summary: normalizeString(c.pricing_summary, 200),
    best_for: normalizeEnum(c.best_for, ALLOWED_BEST_FOR),
    has_free_plan: normalizeBoolean(c.has_free_plan),
    gdpr_compliant: normalizeBoolean(c.gdpr_compliant),
    founded_year: normalizeNumber(c.founded_year, { min: 1950, max: new Date().getFullYear() + 1 }),
    employee_count: normalizeEnum(c.employee_count, ALLOWED_EMPLOYEE_COUNT),
    community_reputation: normalizeNumber(c.community_reputation, { min: 0, max: 5 }),
    has_api: normalizeBoolean(c.has_api),
    has_mobile_app: normalizeBoolean(c.has_mobile_app),
    soc2_certified: normalizeBoolean(c.soc2_certified),
    trial_days: normalizeNumber(c.trial_days, { min: 0, max: 365 }),
    company_hq: normalizeEnum(c.company_hq, ALLOWED_COMPANY_HQ),
    integrations: normalizeStringArray(c.integrations, ALLOWED_INTEGRATIONS),
    support_languages: normalizeStringArray(c.support_languages),
    ui_languages: normalizeStringArray(c.ui_languages),
  }
}

// ─── Web Scraper ──────────────────────────────────────────────────────────────
function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000)
}

async function fetchToolPages(websiteUrl: string): Promise<{ home: string; pricing: string; about: string }> {
  const baseUrl = websiteUrl.replace(/\/$/, '')
  const [home, pricing, about] = await Promise.all([
    fetchTextWithValidation(baseUrl, htmlToText),
    fetchTextWithValidation(`${baseUrl}/pricing`, htmlToText).then(
      (t) => t || fetchTextWithValidation(`${baseUrl}/plans`, htmlToText),
    ),
    fetchTextWithValidation(`${baseUrl}/about`, htmlToText).then(
      (t) =>
        t ||
        fetchTextWithValidation(`${baseUrl}/company`, htmlToText).then(
          (t2) => t2 || fetchTextWithValidation(`${baseUrl}/about-us`, htmlToText),
        ),
    ),
  ])
  return { home, pricing, about }
}

// ─── Claude Extractor ─────────────────────────────────────────────────────────
function extractJson(text: string): string | null {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlock) return codeBlock[1].trim()
  const obj = text.match(/\{[\s\S]*\}/)
  return obj ? obj[0].trim() : null
}

async function extractWithClaude(
  toolName: string,
  websiteUrl: string,
  pages: { home: string; pricing: string; about: string },
  attempt = 1,
): Promise<EnrichedData | null> {
  const prompt = `You are extracting structured data about an AI software tool from its website.

Tool name: ${toolName}
Website: ${websiteUrl}

--- HOMEPAGE ---
${pages.home || '(not available)'}

--- PRICING PAGE ---
${pages.pricing || '(not available)'}

--- ABOUT PAGE ---
${pages.about || '(not available)'}

Extract these fields and return ONLY valid JSON (no markdown, no extra text):

{
  "full_description": "150-250 words describing what this tool does, who it's for, key features and standout capabilities. Plain prose, no marketing fluff.",
  "short_description": "Single sentence, max 120 chars",
  "pricing_summary": "Short format: 'Free / $X-Y/mo / Custom' or similar concise pricing range",
  "best_for": "Solo | Small Team | Mid-Market | Enterprise | All",
  "has_free_plan": true,
  "gdpr_compliant": true,
  "founded_year": 2021,
  "employee_count": "1-10 | 11-50 | 51-200 | 200+",
  "community_reputation": 4.5,
  "has_api": true,
  "has_mobile_app": false,
  "soc2_certified": false,
  "trial_days": 14,
  "company_hq": "USA | EU | UK | Canada | LATAM | Asia | Other",
  "integrations": ["Zapier", "Slack"],
  "support_languages": ["English", "Spanish"],
  "ui_languages": ["English"]
}

Rules:
- Return null for any field you cannot determine with confidence.
- full_description: REQUIRED, 150-250 words. Describe the product clearly.
- short_description: REQUIRED, single sentence under 120 chars.
- pricing_summary: short summary string, not a list.
- community_reputation: 0-5 if you have evidence (G2, Capterra). null otherwise.
- integrations: only from this whitelist: Zapier, Slack, Make, Google Workspace, HubSpot, Notion, Stripe, Other.
- Use full English language names ("English", not "en").`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })
    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return null
    const json = extractJson(textBlock.text)
    if (!json) return null
    return sanitize(JSON.parse(json))
  } catch (err) {
    if (attempt < 2) {
      console.log(`  ↻ retry ${attempt + 1}/2`)
      return extractWithClaude(toolName, websiteUrl, pages, attempt + 1)
    }
    console.error(`  ⚠️  Claude error for ${toolName}:`, err)
    return null
  }
}

// ─── Clearbit Logo ────────────────────────────────────────────────────────────
function buildLogoUrl(websiteUrl: string): string | null {
  try {
    const domain = new URL(websiteUrl).hostname.replace(/^www\./, '')
    return `https://logo.clearbit.com/${domain}`
  } catch {
    return null
  }
}

// ─── Supabase I/O ─────────────────────────────────────────────────────────────
async function readToolsFromSupabase(supabase: SupabaseClient): Promise<ToolRecord[]> {
  let query = supabase
    .from('tools')
    .select('id, name, slug, website_url')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (SLUGS && SLUGS.length) query = query.in('slug', SLUGS)

  const { data, error } = await query
  if (error) throw new Error(`Supabase read failed: ${error.message}`)

  return (data ?? [])
    .filter((r): r is { id: string; name: string; slug: string; website_url: string } =>
      Boolean(r.id && r.name && r.slug && r.website_url),
    )
    .map((r) => ({ id: r.id, name: r.name, slug: r.slug, websiteUrl: r.website_url }))
}

function buildUpdate(data: EnrichedData, logoUrl: string | null): Record<string, unknown> {
  const u: Record<string, unknown> = { last_enriched_at: new Date().toISOString() }
  if (data.full_description) u.full_description = data.full_description
  if (data.short_description) u.short_description = data.short_description
  if (data.pricing_summary) u.pricing_summary = data.pricing_summary
  if (data.best_for) u.best_for = data.best_for
  if (data.has_free_plan !== null) u.has_free_plan = data.has_free_plan
  if (data.gdpr_compliant !== null) u.gdpr_compliant = data.gdpr_compliant
  if (data.founded_year !== null) u.founded_year = data.founded_year
  if (data.employee_count) u.employee_count = data.employee_count
  if (data.community_reputation !== null) u.community_reputation = data.community_reputation
  if (data.has_api !== null) u.has_api = data.has_api
  if (data.has_mobile_app !== null) u.has_mobile_app = data.has_mobile_app
  if (data.soc2_certified !== null) u.soc2_certified = data.soc2_certified
  if (data.trial_days !== null) u.trial_days = data.trial_days
  if (data.company_hq) u.company_hq = data.company_hq
  if (data.integrations) u.integrations = data.integrations
  if (data.support_languages) u.support_languages = data.support_languages
  if (data.ui_languages) u.ui_languages = data.ui_languages
  if (logoUrl) u.logo_url = logoUrl
  return u
}

async function updateToolInSupabase(
  supabase: SupabaseClient,
  toolId: string,
  update: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from('tools').update(update).eq('id', toolId)
  if (error) throw new Error(`Supabase update failed: ${error.message}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const supabase = getSupabase()
  const tools = await readToolsFromSupabase(supabase)
  const toProcess = tools.slice(0, LIMIT === Infinity ? tools.length : LIMIT)

  console.log(`Processing ${toProcess.length} of ${tools.length} tools...\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < toProcess.length; i++) {
    const tool = toProcess[i]
    const progress = `[${i + 1}/${toProcess.length}]`

    process.stdout.write(`${progress} ${tool.name} (${tool.slug}) ... `)

    try {
      const pages = await fetchToolPages(tool.websiteUrl)

      if (!pages.home && !pages.pricing && !pages.about) {
        console.log('⚠️  no pages fetched, skipped')
        skipped++
        continue
      }

      const data = await extractWithClaude(tool.name, tool.websiteUrl, pages)
      if (!data) {
        console.log('⚠️  Claude returned null, skipped')
        skipped++
        continue
      }

      const logoUrl = buildLogoUrl(tool.websiteUrl)
      const update = buildUpdate(data, logoUrl)
      const fieldCount = Object.keys(update).length - 1 // minus last_enriched_at

      if (DRY_RUN) {
        console.log(`✅ dry-run (${fieldCount} fields)`)
        console.log('   ', JSON.stringify({ ...data, logo_url: logoUrl }))
      } else {
        await updateToolInSupabase(supabase, tool.id, update)
        console.log(`✅ updated (${fieldCount} fields)`)
        updated++
      }
    } catch (err) {
      console.log('❌ error:', err)
      failed++
    }

    if (i < toProcess.length - 1) await sleep(2500)
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`✅ Updated:  ${updated}`)
  console.log(`⚠️  Skipped:  ${skipped}`)
  console.log(`❌ Failed:   ${failed}`)
  console.log(`─────────────────────────────────\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
