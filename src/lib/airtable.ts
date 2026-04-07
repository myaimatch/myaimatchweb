import Airtable from 'airtable'
import { unstable_cache } from 'next/cache'

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
  pricingModel?: string
  pricingSummary?: string
  publicRating?: number
  maimScore?: number
  featured: boolean
  status: string
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
    pricingModel: f['Pricing Model'] as string | undefined,
    pricingSummary: f['Pricing Summary'] as string | undefined,
    publicRating: f['Public Rating'] as number | undefined,
    maimScore: f['MAIM Score'] as number | undefined,
    featured: (f['Featured'] as boolean) ?? false,
    status: (f['Status'] as string) ?? '',
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

// ─── Exported Functions ───────────────────────────────────────────────────────

export const fetchAllTools = unstable_cache(
  async (): Promise<AirtableTool[]> => {
    const base = getBase()
    const records = await allRecords(base('Tools'), {
      filterByFormula: `{Status} = "Active"`,
      sort: [{ field: 'Name', direction: 'asc' }],
    })
    return records.map(mapTool)
  },
  ['all-tools'],
  { revalidate: 3600, tags: ['tools'] }
)

export const fetchToolsByCategory = unstable_cache(
  async (categorySlug: string): Promise<AirtableTool[]> => {
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
      filterByFormula: `AND({Status} = "Active", FIND("${categoryId}", ARRAYJOIN({Category})))`,
      sort: [{ field: 'Name', direction: 'asc' }],
    })
    return records.map(mapTool)
  },
  ['tools-by-category'],
  { revalidate: 3600, tags: ['tools'] }
)

export const fetchToolBySlug = unstable_cache(
  async (slug: string): Promise<AirtableTool | null> => {
    const base = getBase()
    const records = await allRecords(base('Tools'), {
      filterByFormula: `{Slug} = "${slug}"`,
      maxRecords: 1,
    })
    return records.length > 0 ? mapTool(records[0]) : null
  },
  ['tool-by-slug'],
  { revalidate: 3600, tags: ['tools'] }
)

export const fetchAllCategories = unstable_cache(
  async (): Promise<AirtableCategory[]> => {
    const base = getBase()
    const records = await allRecords(base('Categories'), {
      sort: [{ field: 'Display Order', direction: 'asc' }],
    })
    return records.map(mapCategory)
  },
  ['all-categories'],
  { revalidate: 3600, tags: ['categories'] }
)
