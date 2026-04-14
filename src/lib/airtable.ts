import Airtable from 'airtable'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AirtableTool {
  id: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  category: string[]       // linked record IDs from Categories table
  subcategory?: string
  websiteUrl: string
  affiliateLink?: string
  affiliateStatus?: string
  logoUrl?: string
  pricingSummary?: string
  communityReputation?: number
  featured: boolean
  // ─── Enriched fields ───────────────────────────────────────────────────────
  supportLanguages?: string[]
  uiLanguages?: string[]
  foundedYear?: number
  hasFreePlan?: boolean
  trialDays?: number
  bestFor?: string
  hasApi?: boolean
  integrations?: string[]
  companyHq?: string
  employeeCount?: string
  gdprCompliant?: boolean
  hasMobileApp?: boolean
  soc2Certified?: boolean
  minMonthlyPrice?: number
  maxMonthlyPrice?: number
}

export interface AirtableCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  displayOrder?: number
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey) throw new Error('Missing AIRTABLE_API_KEY environment variable')
  if (!baseId) throw new Error('Missing AIRTABLE_BASE_ID environment variable')

  return new Airtable({ apiKey }).base(baseId)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safely parse a field that may be string[] (Multi-Select) or string (Long Text) into string[] */
function parseStringArray(val: unknown): string[] | undefined {
  if (!val) return undefined
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean)
  return undefined
}

/** Parse a Long Text "Yes"/"No" field (previously checkbox) into boolean */
function parseBool(val: unknown): boolean | undefined {
  if (val === 'Yes' || val === true) return true
  if (val === 'No' || val === false) return false
  return undefined
}


function allRecords(table: Airtable.Table<Airtable.FieldSet>, opts: Airtable.SelectOptions<Airtable.FieldSet> = {}): Promise<Airtable.Record<Airtable.FieldSet>[]> {
  return new Promise((resolve, reject) => {
    const records: Airtable.Record<Airtable.FieldSet>[] = []
    table.select(opts).eachPage(
      (page, fetchNextPage) => {
        records.push(...page)
        fetchNextPage()
      },
      (err) => {
        if (err) reject(err)
        else resolve(records)
      }
    )
  })
}

function mapTool(record: Airtable.Record<Airtable.FieldSet>): AirtableTool {
  const f = record.fields
  return {
    id: record.id,
    name: (f['Name'] as string) ?? '',
    slug: (f['Slug'] as string) ?? '',
    shortDescription: (f['Short Description'] as string) ?? '',
    fullDescription: (f['Full Description'] as string) ?? '',
    category: (f['Category'] as string[]) ?? [],
    subcategory: f['Subcategory'] as string | undefined,
    websiteUrl: (f['Website URL'] as string) ?? '',
    affiliateLink: f['Affiliate Link'] as string | undefined,
    affiliateStatus: f['Affiliate Status'] as string | undefined,
    logoUrl: f['Logo URL'] as string | undefined,
    pricingSummary: f['Pricing Summary'] as string | undefined,
    communityReputation: f['Community Reputation'] as number | undefined,
    featured: (f['Featured'] as boolean) ?? false,
    // ─── Enriched fields ─────────────────────────────────────────────────────
    supportLanguages: parseStringArray(f['Support Languages']),
    uiLanguages: parseStringArray(f['UI Languages']),
    foundedYear: f['Founded Year'] as number | undefined,
    hasFreePlan: parseBool(f['Has Free Plan']),
    trialDays: f['Trial Days'] as number | undefined,
    bestFor: f['Best For'] as string | undefined,
    hasApi: parseBool(f['Has API']),
    integrations: parseStringArray(f['Integrations']),
    companyHq: f['Company HQ'] as string | undefined,
    employeeCount: f['Employee Count'] as string | undefined,
    gdprCompliant: parseBool(f['GDPR Compliant']),
    hasMobileApp: parseBool(f['Has Mobile App']),
    soc2Certified: parseBool(f['SOC2 Certified']),
    minMonthlyPrice: f['Min Monthly Price'] as number | undefined,
    maxMonthlyPrice: f['Max Monthly Price'] as number | undefined,
  }
}

function mapCategory(record: Airtable.Record<Airtable.FieldSet>): AirtableCategory {
  const f = record.fields
  return {
    id: record.id,
    name: (f['Name'] as string) ?? '',
    slug: (f['Slug'] as string) ?? '',
    description: f['Description'] as string | undefined,
    icon: f['Icon'] as string | undefined,
    displayOrder: f['Display Order'] as number | undefined,
  }
}

// ─── In-memory cache (per serverless instance, TTL 1 hour) ───────────────────

const TTL = 3600 * 1000
const mem: {
  tools?: { data: AirtableTool[]; ts: number }
  categories?: { data: AirtableCategory[]; ts: number }
} = {}

function isFresh(ts: number) {
  return Date.now() - ts < TTL
}

// ─── Exported Functions ───────────────────────────────────────────────────────

export async function fetchAllTools(): Promise<AirtableTool[]> {
  if (mem.tools && isFresh(mem.tools.ts)) return mem.tools.data
  const base = getBase()
  const records = await allRecords(base('Tools'), {
    sort: [{ field: 'Name', direction: 'asc' }],
  })
  const data = records.map(mapTool)
  mem.tools = { data, ts: Date.now() }
  return data
}

export async function fetchToolsByCategory(categorySlug: string): Promise<AirtableTool[]> {
  const base = getBase()

  // Resolve slug → record ID
  const catRecords = await allRecords(base('Categories'), {
    filterByFormula: `{Slug} = "${categorySlug}"`,
    maxRecords: 1,
  })
  if (catRecords.length === 0) return []
  const categoryId = catRecords[0].id

  // Fetch tools linked to that category
  const records = await allRecords(base('Tools'), {
    filterByFormula: `FIND("${categoryId}", ARRAYJOIN({Category}))`,
    sort: [{ field: 'Name', direction: 'asc' }],
  })
  return records.map(mapTool)
}

export async function fetchToolBySlug(slug: string): Promise<AirtableTool | null> {
  const base = getBase()
  const records = await allRecords(base('Tools'), {
    filterByFormula: `{Slug} = "${slug}"`,
    maxRecords: 1,
  })
  return records.length > 0 ? mapTool(records[0]) : null
}

export async function fetchAllCategories(): Promise<AirtableCategory[]> {
  if (mem.categories && isFresh(mem.categories.ts)) return mem.categories.data
  const base = getBase()
  const records = await allRecords(base('Categories'), {
    sort: [{ field: 'Display Order', direction: 'asc' }],
  })
  const data = records.map(mapCategory)
  mem.categories = { data, ts: Date.now() }
  return data
}
