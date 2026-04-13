import Anthropic from '@anthropic-ai/sdk'
import Airtable from 'airtable'
import * as fs from 'fs'
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

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyAIMatch/1.0; +https://myaimatch.ai)' },
    })
    if (!res.ok) return ''
    const html = await res.text()
    return htmlToText(html)
  } catch {
    return ''
  }
}

async function fetchToolPages(websiteUrl: string): Promise<{ home: string; pricing: string; about: string }> {
  const baseUrl = websiteUrl.replace(/\/$/, '')
  const [home, pricing, about] = await Promise.all([
    fetchPage(baseUrl),
    fetchPage(`${baseUrl}/pricing`).then(t => t || fetchPage(`${baseUrl}/plans`)),
    fetchPage(`${baseUrl}/about`).then(t => t || fetchPage(`${baseUrl}/company`).then(t2 => t2 || fetchPage(`${baseUrl}/about-us`))),
  ])
  return { home, pricing, about }
}

// ─── Claude Extractor ─────────────────────────────────────────────────────────
async function extractWithClaude(
  toolName: string,
  websiteUrl: string,
  pages: { home: string; pricing: string; about: string }
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
  "support_languages": ["English"],
  "ui_languages": ["English"],
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
- support_languages: languages available for customer support/help
- ui_languages: languages the product interface supports
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
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return JSON.parse(text) as EnrichedData
  } catch (err) {
    console.error(`  ⚠️  Claude parse error for ${toolName}:`, err)
    return null
  }
}

// ─── Placeholder main ─────────────────────────────────────────────────────────
async function main() {
  const pages = await fetchToolPages('https://notion.so')
  const data = await extractWithClaude('Notion', 'https://notion.so', pages)
  console.log('Extracted:', JSON.stringify(data, null, 2))
}

main().catch(console.error)
