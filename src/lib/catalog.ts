import type { Category, Outcome, Subcategory, Tool } from "@/lib/tool-types";
import {
  fetchAllOutcomesFromSupabase,
  fetchAllSubcategoriesFromSupabase,
  fetchAllToolsFromSupabase,
  fetchToolBySlugFromSupabase,
  fetchToolsByOutcomeFromSupabase,
} from "@/lib/supabase/catalog";

export type { Category, Outcome, Subcategory, Tool };

export async function fetchAllTools(): Promise<Tool[]> {
  return fetchAllToolsFromSupabase();
}

export async function fetchToolsByCategory(categorySlug: string): Promise<Tool[]> {
  return fetchToolsByOutcomeFromSupabase(categorySlug);
}

export async function fetchToolsByOutcome(outcomeSlug: string): Promise<Tool[]> {
  return fetchToolsByOutcomeFromSupabase(outcomeSlug);
}

export async function fetchToolBySlug(slug: string): Promise<Tool | null> {
  return fetchToolBySlugFromSupabase(slug);
}

export async function fetchAllCategories(): Promise<Category[]> {
  return fetchAllOutcomesFromSupabase();
}

export async function fetchAllOutcomes(): Promise<Outcome[]> {
  return fetchAllOutcomesFromSupabase();
}

export async function fetchAllSubcategories(): Promise<Subcategory[]> {
  return fetchAllSubcategoriesFromSupabase();
}
