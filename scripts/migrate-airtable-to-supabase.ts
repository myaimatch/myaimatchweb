import Airtable from "airtable";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !key.trim().startsWith("#")) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

loadEnv();

const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY;

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!airtableApiKey || !airtableBaseId) {
  throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID");
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const airtable = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

type AirtableRecord = Airtable.Record<Airtable.FieldSet>;

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asOptionalString(value: unknown) {
  const parsed = asString(value);
  return parsed || null;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBoolean(value: unknown) {
  return value === true || value === "Yes";
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function isUrl(value: unknown) {
  const parsed = asString(value);
  if (!parsed) return null;
  try {
    const url = new URL(parsed);
    return url.protocol === "http:" || url.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

async function allRecords(tableName: string) {
  const records: AirtableRecord[] = [];

  await new Promise<void>((resolve, reject) => {
    airtable(tableName)
      .select()
      .eachPage(
        (page, fetchNextPage) => {
          records.push(...page);
          fetchNextPage();
        },
        (error) => (error ? reject(error) : resolve()),
      );
  });

  return records;
}

async function tryAllRecords(tableName: string) {
  try {
    return await allRecords(tableName);
  } catch {
    return [];
  }
}

function categoryPayload(record: AirtableRecord) {
  const fields = record.fields;
  return {
    airtable_id: record.id,
    name: asString(fields.Name),
    slug: asString(fields.Slug),
    description: asOptionalString(fields.Description),
    icon: asOptionalString(fields.Icon),
    display_order: asNumber(fields["Display Order"]),
  };
}

function toolPayload(record: AirtableRecord) {
  const fields = record.fields;
  return {
    airtable_id: record.id,
    name: asString(fields.Name),
    slug: asString(fields.Slug),
    short_description: asString(fields["Short Description"] ?? fields.description),
    full_description: asString(fields["Full Description"] ?? fields.description),
    subcategory: asOptionalString(fields.Subcategory),
    website_url: isUrl(fields["Website URL"] ?? fields.website_url) ?? "",
    logo_url: isUrl(fields["Logo URL"] ?? fields.logo_url),
    pricing_summary: asOptionalString(fields["Pricing Summary"] ?? fields.pricing_model),
    community_reputation: asNumber(fields["Community Reputation"] ?? fields.g2_score),
    featured: asBoolean(fields.Featured),
    status: asString(fields.Status, "active").toLowerCase() === "active" ? "active" : "draft",
    support_languages: asStringArray(fields["Support Languages"]),
    ui_languages: asStringArray(fields["UI Languages"]),
    founded_year: asNumber(fields["Founded Year"]),
    has_free_plan: fields["Has Free Plan"] == null ? null : asBoolean(fields["Has Free Plan"]),
    trial_days: asNumber(fields["Trial Days"]),
    best_for: asOptionalString(fields["Best For"]),
    has_api: fields["Has API"] == null ? null : asBoolean(fields["Has API"]),
    integrations: asStringArray(fields.Integrations),
    company_hq: asOptionalString(fields["Company HQ"]),
    employee_count: asOptionalString(fields["Employee Count"]),
    gdpr_compliant: fields["GDPR Compliant"] == null ? null : asBoolean(fields["GDPR Compliant"]),
    has_mobile_app: fields["Has Mobile App"] == null ? null : asBoolean(fields["Has Mobile App"]),
    soc2_certified: fields["SOC2 Certified"] == null ? null : asBoolean(fields["SOC2 Certified"]),
    min_monthly_price: asNumber(fields["Min Monthly Price"] ?? fields.price_from),
    max_monthly_price: asNumber(fields["Max Monthly Price"] ?? fields.price_to),
  };
}

function leadPayload(record: AirtableRecord) {
  const fields = record.fields;
  const email = asString(fields.email ?? fields.Email);
  if (!email) return null;

  const fullName = asString(fields.name ?? fields.Name);
  return {
    email,
    first_name: fullName.split(/\s+/)[0] ?? null,
    full_name: fullName || null,
    business_type: asOptionalString(fields.business_type ?? fields["Business Type"]),
    team_size: asOptionalString(fields.team_size ?? fields["Team Size"]),
    status: asString(fields.status ?? fields.Status, "imported"),
    source: "airtable_import",
    raw_payload: fields,
  };
}

function affiliateStatus(value: unknown) {
  const status = asString(value).toLowerCase();
  if (status === "active" || status === "approved") return "active";
  if (status === "paused" || status === "expired" || status === "rejected") return status;
  return "pending";
}

async function run() {
  const [categoryRecords, toolRecords, leadRecords] = await Promise.all([
    allRecords("Categories"),
    allRecords("Tools"),
    tryAllRecords("Leads / CRM").then((records) => records.length ? records : tryAllRecords("Leads")),
  ]);

  console.log("Affiliate OS migration");
  console.log(`Mode: ${DRY_RUN ? "dry-run" : "apply"}`);
  console.log(`Airtable categories: ${categoryRecords.length}`);
  console.log(`Airtable tools:      ${toolRecords.length}`);
  console.log(`Airtable leads:      ${leadRecords.length}`);

  if (DRY_RUN) {
    const affiliateCount = toolRecords.filter((record) => isUrl(record.fields["Affiliate Link"])).length;
    const dealCount = toolRecords.filter((record) => asBoolean(record.fields["Deal Active"])).length;
    console.log(`Affiliate links found: ${affiliateCount}`);
    console.log(`Active deals found:    ${dealCount}`);
    console.log("Run with --apply to write to Supabase.");
    return;
  }

  const categories = categoryRecords.map(categoryPayload).filter((category) => category.name && category.slug);
  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "airtable_id" })
    .select("id, airtable_id");

  if (categoryError) throw categoryError;

  const categoryIdByAirtableId = new Map(
    (categoryRows ?? []).map((row) => [row.airtable_id as string, row.id as string]),
  );

  const tools = toolRecords.map(toolPayload).filter((tool) => tool.name && tool.slug);
  const { data: toolRows, error: toolError } = await supabase
    .from("tools")
    .upsert(tools, { onConflict: "airtable_id" })
    .select("id, airtable_id");

  if (toolError) throw toolError;

  const toolIdByAirtableId = new Map(
    (toolRows ?? []).map((row) => [row.airtable_id as string, row.id as string]),
  );

  const toolCategories = [];
  for (const record of toolRecords) {
    const toolId = toolIdByAirtableId.get(record.id);
    if (!toolId) continue;

    for (const categoryAirtableId of asStringArray(record.fields.Category)) {
      const categoryId = categoryIdByAirtableId.get(categoryAirtableId);
      if (categoryId) toolCategories.push({ tool_id: toolId, category_id: categoryId });
    }
  }

  if (toolCategories.length) {
    const { error } = await supabase
      .from("tool_categories")
      .upsert(toolCategories, { onConflict: "tool_id,category_id" });
    if (error) throw error;
  }

  const affiliateLinks = [];
  const deals = [];
  for (const record of toolRecords) {
    const toolId = toolIdByAirtableId.get(record.id);
    if (!toolId) continue;

    const affiliateUrl = isUrl(record.fields["Affiliate Link"]);
    if (affiliateUrl) {
      affiliateLinks.push({
        tool_id: toolId,
        url: affiliateUrl,
        status: affiliateStatus(record.fields["Affiliate Status"]),
        priority: 10,
        approved_at: affiliateStatus(record.fields["Affiliate Status"]) === "active" ? new Date().toISOString() : null,
        label: "Imported from Airtable",
      });
    }

    if (asBoolean(record.fields["Deal Active"])) {
      deals.push({
        tool_id: toolId,
        promo_code: asOptionalString(record.fields.Promo),
        description: asOptionalString(record.fields["Deal Description"]),
        status: "active",
        rank: asNumber(record.fields["Deal Rank"]) ?? 100,
        approved_at: new Date().toISOString(),
      });
    }
  }

  if (affiliateLinks.length) {
    const { error } = await supabase.from("affiliate_links").insert(affiliateLinks);
    if (error) throw error;
  }

  if (deals.length) {
    const { error } = await supabase.from("deals").insert(deals);
    if (error) throw error;
  }

  const leads = leadRecords.map(leadPayload).filter((lead): lead is NonNullable<typeof lead> => !!lead);
  if (leads.length) {
    const { error } = await supabase.from("leads").upsert(leads, { onConflict: "email" });
    if (error) throw error;
  }

  console.log(`Imported categories:      ${categories.length}`);
  console.log(`Imported tools:           ${tools.length}`);
  console.log(`Linked tool categories:   ${toolCategories.length}`);
  console.log(`Imported affiliate links: ${affiliateLinks.length}`);
  console.log(`Imported deals:           ${deals.length}`);
  console.log(`Imported leads:           ${leads.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
