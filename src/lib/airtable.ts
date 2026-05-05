import type { AirtableCategory, AirtableTool } from "@/lib/tool-types";
import {
  fetchAllCategoriesFromSupabase,
  fetchAllToolsFromSupabase,
  fetchToolBySlugFromSupabase,
  fetchToolsByCategoryFromSupabase,
} from "@/lib/supabase/catalog";

export type { AirtableCategory, AirtableTool };

export async function fetchAllTools(): Promise<AirtableTool[]> {
  return fetchAllToolsFromSupabase();
}

export async function fetchToolsByCategory(categorySlug: string): Promise<AirtableTool[]> {
  return fetchToolsByCategoryFromSupabase(categorySlug);
}

export async function fetchToolBySlug(slug: string): Promise<AirtableTool | null> {
  return fetchToolBySlugFromSupabase(slug);
}

export async function fetchAllCategories(): Promise<AirtableCategory[]> {
  return fetchAllCategoriesFromSupabase();
}
