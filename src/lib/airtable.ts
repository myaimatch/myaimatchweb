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

type GeneratedField<T = unknown> = {
  state?: string
  value?: T
  isStale?: boolean
  errorType?: string
}

function isGeneratedField(value: unknown): value is GeneratedField {
  return (
    !!value &&
    typeof value === 'object' &&
    'state' in value &&
    'value' in value &&
    'isStale' in value
  )
}

function unwrapAirtableValue(value: unknown): unknown {
  return isGeneratedField(value) ? value.value : value
}

function asString(value: unknown, fallback = ''): string {
  const unwrapped = unwrapAirtableValue(value)
  if (typeof unwrapped === 'string') return unwrapped
  if (typeof unwrapped === 'number' || typeof unwrapped === 'boolean') return String(unwrapped)
  return fallback
}

function asOptionalString(value: unknown): string | undefined {
  const parsed = asString(value).trim()
  return parsed || undefined
}

function asUrlString(value: unknown): string | undefined {
  const parsed = asOptionalString(value)
  if (!parsed) return undefined

  try {
    const url = new URL(parsed)
    return url.protocol === 'http:' || url.protocol === 'https:' ? parsed : undefined
  } catch {
    return undefined
  }
}

function asNumber(value: unknown): number | undefined {
  const unwrapped = unwrapAirtableValue(value)
  if (typeof unwrapped === 'number' && Number.isFinite(unwrapped)) return unwrapped
  if (typeof unwrapped === 'string') {
    const parsed = Number(unwrapped)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function asBoolean(value: unknown): boolean | undefined {
  const unwrapped = unwrapAirtableValue(value)
  if (unwrapped === true || unwrapped === 'Yes') return true
  if (unwrapped === false || unwrapped === 'No') return false
  return undefined
}

/** Safely parse a field that may be string[] (Multi-Select) or string (Long Text) into string[] */
function asStringArray(value: unknown): string[] | undefined {
  const unwrapped = unwrapAirtableValue(value)
  if (!unwrapped) return undefined
  if (Array.isArray(unwrapped)) {
    const strings = unwrapped
      .map((item) => asOptionalString(item))
      .filter((item): item is string => !!item)
    return strings.length ? strings : undefined
  }
  if (typeof unwrapped === 'string') {
    const strings = unwrapped.split(',').map(s => s.trim()).filter(Boolean)
    return strings.length ? strings : undefined
  }
  return undefined
}

function assertNoObjectFields(value: Record<string, unknown>, path: string) {
  if (process.env.NODE_ENV === 'production') return

  for (const [key, fieldValue] of Object.entries(value)) {
    if (!fieldValue || typeof fieldValue !== 'object') continue

    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((item, index) => {
        if (item && typeof item === 'object') {
          throw new Error(`Airtable mapper returned object array item at ${path}.${key}[${index}]`)
        }
      })
      continue
    }

    throw new Error(`Airtable mapper returned object field at ${path}.${key}`)
  }
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
  const tool = {
    id: record.id,
    name: asString(f['Name']),
    slug: asString(f['Slug']),
    shortDescription: asString(f['Short Description']),
    fullDescription: asString(f['Full Description']),
    category: asStringArray(f['Category']) ?? [],
    subcategory: asOptionalString(f['Subcategory']),
    websiteUrl: asUrlString(f['Website URL']) ?? '',
    affiliateLink: asUrlString(f['Affiliate Link']),
    affiliateStatus: asOptionalString(f['Affiliate Status']),
    logoUrl: asUrlString(f['Logo URL']),
    pricingSummary: asOptionalString(f['Pricing Summary']),
    communityReputation: asNumber(f['Community Reputation']),
    featured: asBoolean(f['Featured']) ?? false,
    // ─── Enriched fields ─────────────────────────────────────────────────────
    supportLanguages: asStringArray(f['Support Languages']),
    uiLanguages: asStringArray(f['UI Languages']),
    foundedYear: asNumber(f['Founded Year']),
    hasFreePlan: asBoolean(f['Has Free Plan']),
    trialDays: asNumber(f['Trial Days']),
    bestFor: asOptionalString(f['Best For']),
    hasApi: asBoolean(f['Has API']),
    integrations: asStringArray(f['Integrations']),
    companyHq: asOptionalString(f['Company HQ']),
    employeeCount: asOptionalString(f['Employee Count']),
    gdprCompliant: asBoolean(f['GDPR Compliant']),
    hasMobileApp: asBoolean(f['Has Mobile App']),
    soc2Certified: asBoolean(f['SOC2 Certified']),
    minMonthlyPrice: asNumber(f['Min Monthly Price']),
    maxMonthlyPrice: asNumber(f['Max Monthly Price']),
  }

  assertNoObjectFields(tool, `tool:${record.id}`)
  return tool
}

function mapCategory(record: Airtable.Record<Airtable.FieldSet>): AirtableCategory {
  const f = record.fields
  const category = {
    id: record.id,
    name: asString(f['Name']),
    slug: asString(f['Slug']),
    description: asOptionalString(f['Description']),
    icon: asOptionalString(f['Icon']),
    displayOrder: asNumber(f['Display Order']),
  }

  assertNoObjectFields(category, `category:${record.id}`)
  return category
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
