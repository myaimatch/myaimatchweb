import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import {
  classifyToolForOutcomeMigration,
  validateOutcomeProposal,
  type OutcomeMigrationProposal,
} from "../src/lib/outcome-migration";

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
const REVIEWED = args.includes("--reviewed");
const outputArg = args.find((arg) => arg.startsWith("--output="));
const inputArg = args.find((arg) => arg.startsWith("--input="));
const OUTPUT_FILE = path.resolve(process.cwd(), outputArg?.split("=")[1] ?? "migration-proposals.json");
const INPUT_FILE = path.resolve(process.cwd(), inputArg?.split("=")[1] ?? OUTPUT_FILE);

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase service configuration");
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

interface ToolRow {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  subcategory: string | null;
  status: string;
}

interface LegacyCategoryRow {
  tool_id: string;
  tool_slug?: string | null;
  category_name?: string | null;
  subcategory?: string | null;
}

interface ToolCategoryRow {
  tool_id: string;
  category_id: string;
}

interface CategoryRow {
  id: string;
  name: string;
}

interface OutcomeRow {
  id: string;
  slug: string;
}

interface SubcategoryRow {
  id: string;
  slug: string;
  outcome_id: string;
}

function groupLegacyCategories(rows: LegacyCategoryRow[]) {
  const grouped = new Map<string, { categories: string[]; subcategory?: string }>();

  for (const row of rows) {
    const current = grouped.get(row.tool_id) ?? { categories: [], subcategory: row.subcategory ?? undefined };
    if (row.category_name && !current.categories.includes(row.category_name)) {
      current.categories.push(row.category_name);
    }
    if (!current.subcategory && row.subcategory) current.subcategory = row.subcategory;
    grouped.set(row.tool_id, current);
  }

  return grouped;
}

async function fetchActiveTools(supabase: SupabaseClient): Promise<ToolRow[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, short_description, full_description, subcategory, status")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw new Error(`Tool fetch failed: ${error.message}`);
  return (data ?? []) as ToolRow[];
}

async function fetchLegacyContext(supabase: SupabaseClient) {
  const snapshot = await supabase
    .from("outcome_migration_legacy_tool_categories")
    .select("tool_id, tool_slug, category_name, subcategory");

  if (!snapshot.error && snapshot.data && snapshot.data.length > 0) {
    return groupLegacyCategories(snapshot.data as LegacyCategoryRow[]);
  }

  const [{ data: links, error: linkError }, { data: categories, error: categoryError }] = await Promise.all([
    supabase.from("tool_categories").select("tool_id, category_id"),
    supabase.from("categories").select("id, name"),
  ]);

  if (linkError) throw new Error(`Legacy tool_categories fetch failed: ${linkError.message}`);
  if (categoryError) throw new Error(`Legacy categories fetch failed: ${categoryError.message}`);

  const categoryById = new Map(((categories ?? []) as CategoryRow[]).map((category) => [category.id, category.name]));
  return groupLegacyCategories(
    ((links ?? []) as ToolCategoryRow[]).map((link) => ({
      tool_id: link.tool_id,
      category_name: categoryById.get(link.category_id) ?? null,
    })),
  );
}

async function buildProposals(supabase: SupabaseClient): Promise<OutcomeMigrationProposal[]> {
  const [tools, legacyByTool] = await Promise.all([
    fetchActiveTools(supabase),
    fetchLegacyContext(supabase),
  ]);

  return tools.map((tool) => {
    const legacy = legacyByTool.get(tool.id);
    return classifyToolForOutcomeMigration({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      currentCategories: legacy?.categories ?? [],
      currentSubcategory: legacy?.subcategory ?? tool.subcategory ?? "",
      shortDescription: tool.short_description ?? "",
      fullDescription: tool.full_description ?? "",
    });
  });
}

function readReviewedProposals(): OutcomeMigrationProposal[] {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Proposal file not found: ${INPUT_FILE}`);
  }
  const parsed = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8")) as unknown;
  if (!Array.isArray(parsed)) throw new Error("Proposal file must contain a JSON array");
  return parsed as OutcomeMigrationProposal[];
}

function assertValidProposals(proposals: OutcomeMigrationProposal[]) {
  const failures = proposals
    .map((proposal) => ({ proposal, validation: validateOutcomeProposal(proposal) }))
    .filter((item) => !item.validation.valid);

  if (failures.length > 0) {
    throw new Error(
      failures
        .map((item) => `${item.proposal.toolName} (${item.proposal.toolSlug}): ${item.validation.errors.join("; ")}`)
        .join("\n"),
    );
  }

  const duplicatePrimary = proposals.filter((proposal) => !proposal.primaryOutcomeSlug);
  if (duplicatePrimary.length > 0) {
    throw new Error(`Missing primary outcome for ${duplicatePrimary.length} tools`);
  }
}

async function applyProposals(supabase: SupabaseClient, proposals: OutcomeMigrationProposal[]) {
  if (!REVIEWED) {
    throw new Error("Refusing to apply without --reviewed. Review migration-proposals.json first.");
  }

  assertValidProposals(proposals);

  const [tools, outcomeResult, subcategoryResult] = await Promise.all([
    fetchActiveTools(supabase),
    supabase.from("outcomes").select("id, slug"),
    supabase.from("subcategories").select("id, slug, outcome_id"),
  ]);

  if (outcomeResult.error) throw new Error(`Outcomes fetch failed: ${outcomeResult.error.message}`);
  if (subcategoryResult.error) throw new Error(`Subcategories fetch failed: ${subcategoryResult.error.message}`);

  const proposalToolIds = new Set(proposals.flatMap((proposal) => proposal.toolId ? [proposal.toolId] : []));
  const missing = tools.map((tool) => tool.id).filter((toolId) => !proposalToolIds.has(toolId));
  if (missing.length > 0) throw new Error(`${missing.length} active tools are missing reviewed proposals`);

  const outcomesBySlug = new Map(((outcomeResult.data ?? []) as OutcomeRow[]).map((row) => [row.slug, row]));
  const subcategoriesBySlug = new Map(((subcategoryResult.data ?? []) as SubcategoryRow[]).map((row) => [row.slug, row]));

  for (const proposal of proposals) {
    if (!proposal.toolId) throw new Error(`Proposal for ${proposal.toolName} is missing toolId`);

    const primary = outcomesBySlug.get(proposal.primaryOutcomeSlug);
    if (!primary) throw new Error(`Unknown primary outcome slug: ${proposal.primaryOutcomeSlug}`);

    const secondaryRows = proposal.secondaryOutcomeSlugs
      .filter((slug) => slug !== proposal.primaryOutcomeSlug)
      .map((slug) => {
        const outcome = outcomesBySlug.get(slug);
        if (!outcome) throw new Error(`Unknown secondary outcome slug: ${slug}`);
        return outcome;
      });

    const subcategoryRows = proposal.subcategorySlugs.map((slug) => {
      const subcategory = subcategoriesBySlug.get(slug);
      if (!subcategory) throw new Error(`Unknown subcategory slug: ${slug}`);
      return subcategory;
    });

    const { error: deleteSubcategoriesError } = await supabase
      .from("tool_subcategories")
      .delete()
      .eq("tool_id", proposal.toolId);
    if (deleteSubcategoriesError) throw new Error(`Delete tool_subcategories failed for ${proposal.toolName}: ${deleteSubcategoriesError.message}`);

    const { error: deleteOutcomesError } = await supabase
      .from("tool_outcomes")
      .delete()
      .eq("tool_id", proposal.toolId);
    if (deleteOutcomesError) throw new Error(`Delete tool_outcomes failed for ${proposal.toolName}: ${deleteOutcomesError.message}`);

    const outcomeRows = [
      { tool_id: proposal.toolId, outcome_id: primary.id, is_primary: true },
      ...secondaryRows.map((outcome) => ({ tool_id: proposal.toolId!, outcome_id: outcome.id, is_primary: false })),
    ];
    const { error: outcomeInsertError } = await supabase.from("tool_outcomes").insert(outcomeRows);
    if (outcomeInsertError) throw new Error(`Insert tool_outcomes failed for ${proposal.toolName}: ${outcomeInsertError.message}`);

    const { error: subcategoryInsertError } = await supabase.from("tool_subcategories").insert(
      subcategoryRows.map((subcategory) => ({
        tool_id: proposal.toolId,
        subcategory_id: subcategory.id,
      })),
    );
    if (subcategoryInsertError) throw new Error(`Insert tool_subcategories failed for ${proposal.toolName}: ${subcategoryInsertError.message}`);
  }

  await verifyAppliedMigration(supabase);
}

async function verifyAppliedMigration(supabase: SupabaseClient) {
  const [tools, toolOutcomes, toolSubcategories] = await Promise.all([
    fetchActiveTools(supabase),
    supabase.from("tool_outcomes").select("tool_id, is_primary"),
    supabase.from("tool_subcategories").select("tool_id"),
  ]);

  if (toolOutcomes.error) throw new Error(`tool_outcomes verification failed: ${toolOutcomes.error.message}`);
  if (toolSubcategories.error) throw new Error(`tool_subcategories verification failed: ${toolSubcategories.error.message}`);

  const primaryCounts = new Map<string, number>();
  for (const row of (toolOutcomes.data ?? []) as Array<{ tool_id: string; is_primary: boolean }>) {
    if (row.is_primary) primaryCounts.set(row.tool_id, (primaryCounts.get(row.tool_id) ?? 0) + 1);
  }

  const subcategoryToolIds = new Set(((toolSubcategories.data ?? []) as Array<{ tool_id: string }>).map((row) => row.tool_id));
  const missingPrimary = tools.filter((tool) => (primaryCounts.get(tool.id) ?? 0) === 0);
  const tooManyPrimary = tools.filter((tool) => (primaryCounts.get(tool.id) ?? 0) > 1);
  const missingSubcategories = tools.filter((tool) => !subcategoryToolIds.has(tool.id));

  if (missingPrimary.length || tooManyPrimary.length || missingSubcategories.length) {
    throw new Error([
      missingPrimary.length ? `${missingPrimary.length} active tools missing primary outcomes` : "",
      tooManyPrimary.length ? `${tooManyPrimary.length} active tools have multiple primary outcomes` : "",
      missingSubcategories.length ? `${missingSubcategories.length} active tools missing subcategories` : "",
    ].filter(Boolean).join("; "));
  }
}

async function main() {
  const supabase = getSupabase();

  if (APPLY) {
    const proposals = readReviewedProposals();
    await applyProposals(supabase, proposals);
    console.log(`Applied ${proposals.length} reviewed outcome migration proposals.`);
    return;
  }

  const proposals = await buildProposals(supabase);
  assertValidProposals(proposals);
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(proposals, null, 2)}\n`);

  const lowConfidence = proposals.filter((proposal) => proposal.confidence === "low").length;
  const mediumConfidence = proposals.filter((proposal) => proposal.confidence === "medium").length;
  const highConfidence = proposals.filter((proposal) => proposal.confidence === "high").length;

  console.log(`Wrote ${proposals.length} proposals to ${OUTPUT_FILE}`);
  console.log(`Confidence: ${highConfidence} high, ${mediumConfidence} medium, ${lowConfidence} low`);
  console.log("Review the file, edit any mappings, then run: npm run outcomes:apply -- --reviewed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
