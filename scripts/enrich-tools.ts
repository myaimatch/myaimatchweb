import Anthropic from '@anthropic-ai/sdk'
import { lookup } from 'dns/promises'
import Airtable from 'airtable'
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
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity

console.log(`\n🔧 Enrich Tools Script`)
console.log(`   Dry run: ${DRY_RUN}`)
console.log(`   Limit:   ${LIMIT === Infinity ? 'all' : LIMIT}\n`)

// ─── Clients ──────────────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
)

// ─── Types ────────────────────────────────────────────────────────────────────
interface ToolRecord {
  id: string
  name: string
  websiteUrl: string
}

interface EnrichedData {
  support_languages: string[] | null
  ui_languages: string[] | null
  founded_year: number | null
  has_free_plan: boolean | null
  trial_days: number | null
  best_for: string | null
  has_api: boolean | null
  integrations: string[] | null
  company_hq: string | null
  employee_count: string | null
  gdpr_compliant: boolean | null
  has_mobile_app: boolean | null
  soc2_certified: boolean | null
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
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true
  }

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
  const normalized = ip.toLowerCase()
  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  )
}

function isPrivateIpAddress(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return isPrivateIpv4(ip)
  if (family === 6) return isPrivateIpv6(ip)
  return true
}

async function assertSafeRemoteUrl(rawUrl: string): Promise<URL> {
  const url = new URL(rawUrl)

  if (url.protocol !== 'https:') {
    throw new Error(`Unsafe protocol for enrichment fetch: ${url.protocol}`)
  }

  if (url.username || url.password) {
    throw new Error('Refusing URLs with embedded credentials')
  }

  if (isPrivateHostname(url.hostname)) {
    throw new Error(`Refusing private hostname: ${url.hostname}`)
  }

  if (isIP(url.hostname) && isPrivateIpAddress(url.hostname)) {
    throw new Error(`Refusing private IP address: ${url.hostname}`)
  }

  if (!isIP(url.hostname)) {
    const resolved = await lookup(url.hostname, { all: true })
    if (!resolved.length) {
      throw new Error(`Could not resolve hostname: ${url.hostname}`)
    }

    for (const entry of resolved) {
      if (isPrivateIpAddress(entry.address)) {
        throw new Error(`Hostname resolves to private IP: ${url.hostname}`)
      }
    }
  }

  return url
}

async function fetchTextWithValidation(
  rawUrl: string,
  transform?: (html: string) => string
): Promise<string> {
  let currentUrl = await assertSafeRemoteUrl(rawUrl)

  for (let redirectCount = 0; redirectCount < 4; redirectCount++) {
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

function normalizeEnum(value: unknown, allowedValues: Set<string>): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return allowedValues.has(normalized) ? normalized : null
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

function normalizeStringArray(value: unknown, allowedValues?: Set<string>): string[] | null {
  if (!Array.isArray(value)) return null

  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .filter((item) => !allowedValues || allowedValues.has(item))

  return cleaned.length ? cleaned : null
}

function sanitizeEnrichedData(data: unknown): EnrichedData | null {
  if (!data || typeof data !== 'object') return null

  const candidate = data as Record<string, unknown>

  return {
    support_languages: normalizeStringArray(candidate.support_languages),
    ui_languages: normalizeStringArray(candidate.ui_languages),
    founded_year: normalizeNumber(candidate.founded_year, { min: 1950, max: new Date().getFullYear() + 1 }),
    has_free_plan: normalizeBoolean(candidate.has_free_plan),
    trial_days: normalizeNumber(candidate.trial_days, { min: 0, max: 365 }),
    best_for: normalizeEnum(candidate.best_for, ALLOWED_BEST_FOR),
    has_api: normalizeBoolean(candidate.has_api),
    integrations: normalizeStringArray(candidate.integrations, ALLOWED_INTEGRATIONS),
    company_hq: normalizeEnum(candidate.company_hq, ALLOWED_COMPANY_HQ),
    employee_count: normalizeEnum(candidate.employee_count, ALLOWED_EMPLOYEE_COUNT),
    gdpr_compliant: normalizeBoolean(candidate.gdpr_compliant),
    has_mobile_app: normalizeBoolean(candidate.has_mobile_app),
    soc2_certified: normalizeBoolean(candidate.soc2_certified),
  }
}

// ─── Language Hints Extractor ─────────────────────────────────────────────────
const ISO_TO_LANG: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
  it: 'Italian', nl: 'Dutch', ru: 'Russian', ja: 'Japanese', zh: 'Chinese',
  ko: 'Korean', ar: 'Arabic', hi: 'Hindi', pl: 'Polish', sv: 'Swedish',
  da: 'Danish', fi: 'Finnish', no: 'Norwegian', tr: 'Turkish', th: 'Thai',
  vi: 'Vietnamese', id: 'Indonesian', cs: 'Czech', ro: 'Romanian', uk: 'Ukrainian',
  he: 'Hebrew', hu: 'Hungarian', el: 'Greek', bg: 'Bulgarian', hr: 'Croatian',
}

function isoToName(code: string): string {
  const base = code.split(/[-_]/)[0].toLowerCase()
  return ISO_TO_LANG[base] || code
}

interface LanguageHints {
  htmlLang: string | null
  hreflangs: string[]
  ogLocales: string[]
}

function extractLanguageHints(html: string): LanguageHints {
  // <html lang="en"> or <html xml:lang="en">
  const langMatch = html.match(/<html[^>]+(?:xml:)?lang=["']([^"']+)["']/i)
  const htmlLang = langMatch ? isoToName(langMatch[1]) : null

  // <link rel="alternate" hreflang="es" href="...">
  const hreflangs: string[] = []
  const hreflangRegex = /hreflang=["']([a-z]{2}(?:[-_][a-zA-Z]{2,4})?)["']/gi
  let m: RegExpExecArray | null
  while ((m = hreflangRegex.exec(html)) !== null) {
    const lang = isoToName(m[1])
    if (lang !== 'x-default' && !hreflangs.includes(lang)) hreflangs.push(lang)
  }

  // <meta property="og:locale" content="en_US"> and og:locale:alternate
  const ogLocales: string[] = []
  const ogRegex = /property=["']og:locale(?::alternate)?["'][^>]+content=["']([^"']+)["']/gi
  while ((m = ogRegex.exec(html)) !== null) {
    const lang = isoToName(m[1])
    if (!ogLocales.includes(lang)) ogLocales.push(lang)
  }
  // Also match reversed attribute order: content before property
  const ogRegex2 = /content=["']([^"']+)["'][^>]+property=["']og:locale(?::alternate)?["']/gi
  while ((m = ogRegex2.exec(html)) !== null) {
    const lang = isoToName(m[1])
    if (!ogLocales.includes(lang)) ogLocales.push(lang)
  }

  return { htmlLang, hreflangs, ogLocales }
}

// ─── Language Research (Web Search) ───────────────────────────────────────────
async function researchLanguages(
  toolName: string,
  websiteUrl: string,
  languageHints: LanguageHints
): Promise<{ support_languages: string[]; ui_languages: string[] }> {
  const fallback = {
    support_languages: [languageHints.htmlLang || 'English'],
    ui_languages: [languageHints.htmlLang || 'English'],
  }

  const hintsText = [
    languageHints.htmlLang ? `Page language: ${languageHints.htmlLang}` : null,
    languageHints.hreflangs.length ? `hreflang tags found: ${languageHints.hreflangs.join(', ')}` : null,
    languageHints.ogLocales.length ? `OG locales: ${languageHints.ogLocales.join(', ')}` : null,
  ].filter(Boolean).join('\n')

  const prompt = `Find ALL supported languages for the software tool "${toolName}" (${websiteUrl}).

${hintsText ? `Known language signals from their website:\n${hintsText}\n` : ''}Search for "${toolName} supported languages" — check G2, Capterra, TrustRadius, official help docs, or documentation pages.

Return ONLY valid JSON (no markdown, no extra text):
{
  "support_languages": ["English", "Spanish", ...],
  "ui_languages": ["English", "Spanish", ...]
}

Rules:
- support_languages: languages the product's customer support / help center is available in
- ui_languages: languages the product interface / UI can be set to
- Include ALL languages you can find evidence for — be thorough
- Use full English names (e.g. "English" not "en", "Spanish" not "es")
- If you cannot find specific info for one field, copy from the other (they often overlap)
- At minimum return ["English"] if the product clearly operates in English`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search', max_uses: 3 }],
      messages: [{ role: 'user', content: prompt }],
    })

    // Find the last text block (after web search results)
    const textBlock = response.content.filter(b => b.type === 'text').pop()
    if (!textBlock || textBlock.type !== 'text') return fallback

    let text = textBlock.text

    // Extract JSON: try markdown code block first, then find raw JSON object
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim()
    } else {
      const jsonObjMatch = text.match(/\{[\s\S]*\}/)
      if (jsonObjMatch) {
        text = jsonObjMatch[0].trim()
      } else {
        // No JSON found — Claude returned plain text (no results from search)
        return fallback
      }
    }

    const parsed = JSON.parse(text) as { support_languages?: string[]; ui_languages?: string[] }
    return {
      support_languages: normalizeStringArray(parsed.support_languages)?.slice(0, 12) ?? fallback.support_languages,
      ui_languages: normalizeStringArray(parsed.ui_languages)?.slice(0, 12) ?? fallback.ui_languages,
    }
  } catch (err) {
    console.error(`  ⚠️  Language research error for ${toolName}:`, err)
    return fallback
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

async function fetchRawHtml(url: string): Promise<string> {
  return fetchTextWithValidation(url)
}

async function fetchPage(url: string): Promise<string> {
  return fetchTextWithValidation(url, htmlToText)
}

async function fetchToolPages(websiteUrl: string): Promise<{ home: string; pricing: string; about: string; homeRawHtml: string }> {
  const baseUrl = websiteUrl.replace(/\/$/, '')
  const [home, pricing, about, homeRawHtml] = await Promise.all([
    fetchPage(baseUrl),
    fetchPage(`${baseUrl}/pricing`).then(t => t || fetchPage(`${baseUrl}/plans`)),
    fetchPage(`${baseUrl}/about`).then(t => t || fetchPage(`${baseUrl}/company`).then(t2 => t2 || fetchPage(`${baseUrl}/about-us`))),
    fetchRawHtml(baseUrl),
  ])
  return { home, pricing, about, homeRawHtml }
}

// ─── Claude Extractor ─────────────────────────────────────────────────────────
async function extractWithClaude(
  toolName: string,
  websiteUrl: string,
  pages: { home: string; pricing: string; about: string }
): Promise<Omit<EnrichedData, 'support_languages' | 'ui_languages'> | null> {
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
  "founded_year": 2021,
  "has_free_plan": true,
  "trial_days": 14,
  "best_for": "Small Team",
  "has_api": true,
  "integrations": ["Zapier", "Slack"],
  "company_hq": "USA",
  "employee_count": "11-50",
  "gdpr_compliant": false,
  "has_mobile_app": false,
  "soc2_certified": false
}

Rules:
- Return null for any field you cannot determine with confidence
- trial_days: 0 if no trial, null if unknown
- best_for: one of exactly: Solo, Small Team, Mid-Market, Enterprise, All
- integrations: only from this list: Zapier, Slack, Make, Google Workspace, HubSpot, Notion, Stripe, Other
- company_hq: one of exactly: USA, EU, UK, Canada, LATAM, Asia, Other
- employee_count: one of exactly: 1-10, 11-50, 51-200, 200+`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    let text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      text = jsonMatch[1].trim()
    }

    return sanitizeEnrichedData(JSON.parse(text))
  } catch (err) {
    console.error(`  ⚠️  Claude parse error for ${toolName}:`, err)
    return null
  }
}

// ─── Airtable I/O ─────────────────────────────────────────────────────────────
async function readToolsFromAirtable(): Promise<ToolRecord[]> {
  const tools: ToolRecord[] = []
  await new Promise<void>((resolve, reject) => {
    base('Tools')
      .select({
        filterByFormula: `{Status} = "Active"`,
        fields: ['Name', 'Website URL'],
      })
      .eachPage(
        (records, fetchNextPage) => {
          for (const r of records) {
            const name = r.fields['Name'] as string | undefined
            const url = r.fields['Website URL'] as string | undefined
            if (name && url) tools.push({ id: r.id, name, websiteUrl: url })
          }
          fetchNextPage()
        },
        err => (err ? reject(err) : resolve())
      )
  })
  return tools
}

function buildAirtableFields(data: EnrichedData): Record<string, unknown> {
  const fields: Record<string, unknown> = {}
  if (data.support_languages !== null) fields['Support Languages'] = data.support_languages
  if (data.ui_languages !== null) fields['UI Languages'] = data.ui_languages
  if (data.founded_year !== null) fields['Founded Year'] = data.founded_year
  if (data.has_free_plan !== null) fields['Has Free Plan'] = data.has_free_plan
  if (data.trial_days !== null) fields['Trial Days'] = data.trial_days
  if (data.best_for !== null) fields['Best For'] = data.best_for
  if (data.has_api !== null) fields['Has API'] = data.has_api
  if (data.integrations !== null) fields['Integrations'] = data.integrations
  if (data.company_hq !== null) fields['Company HQ'] = data.company_hq
  if (data.employee_count !== null) fields['Employee Count'] = data.employee_count
  if (data.gdpr_compliant !== null) fields['GDPR Compliant'] = data.gdpr_compliant
  if (data.has_mobile_app !== null) fields['Has Mobile App'] = data.has_mobile_app
  if (data.soc2_certified !== null) fields['SOC2 Certified'] = data.soc2_certified
  return fields
}

async function updateAirtableRecord(recordId: string, fields: Record<string, unknown>): Promise<void> {
  if (Object.keys(fields).length === 0) return
  await base('Tools').update(recordId, fields as Airtable.FieldSet)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const tools = await readToolsFromAirtable()
  const toProcess = tools.slice(0, LIMIT === Infinity ? tools.length : LIMIT)

  console.log(`Processing ${toProcess.length} of ${tools.length} tools...\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < toProcess.length; i++) {
    const tool = toProcess[i]
    const progress = `[${i + 1}/${toProcess.length}]`

    process.stdout.write(`${progress} ${tool.name} ... `)

    try {
      await assertSafeRemoteUrl(tool.websiteUrl)
      const { home, pricing, about, homeRawHtml } = await fetchToolPages(tool.websiteUrl)

      if (!home && !pricing && !about) {
        console.log('⚠️  no pages fetched, skipped')
        skipped++
        continue
      }

      const languageHints = extractLanguageHints(homeRawHtml)

      // Run language research (web search) and general extraction in parallel
      const [langData, generalData] = await Promise.all([
        researchLanguages(tool.name, tool.websiteUrl, languageHints),
        extractWithClaude(tool.name, tool.websiteUrl, { home, pricing, about }),
      ])

      const data: EnrichedData | null = generalData
        ? { support_languages: langData.support_languages, ui_languages: langData.ui_languages, ...generalData }
        : null

      if (!data) {
        console.log('⚠️  Claude returned null, skipped')
        skipped++
        continue
      }

      const fields = buildAirtableFields(data)
      const fieldCount = Object.keys(fields).length

      if (DRY_RUN) {
        console.log(`✅ dry-run (${fieldCount} fields)`)
        console.log('   ', JSON.stringify(data))
      } else {
        await updateAirtableRecord(tool.id, fields)
        console.log(`✅ updated (${fieldCount} fields)`)
        updated++
      }
    } catch (err) {
      console.log('❌ error:', err)
      failed++
    }

    // Rate limit: 2.5s between tools to respect Airtable + Claude + web search limits
    if (i < toProcess.length - 1) await sleep(2500)
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`✅ Updated:  ${updated}`)
  console.log(`⚠️  Skipped:  ${skipped}`)
  console.log(`❌ Failed:   ${failed}`)
  console.log(`─────────────────────────────────\n`)
}

main().catch(console.error)
