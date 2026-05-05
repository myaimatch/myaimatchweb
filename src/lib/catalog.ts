import type { Category, Tool } from "@/lib/tool-types";
import {
  fetchAllCategoriesFromSupabase,
  fetchAllToolsFromSupabase,
  fetchToolBySlugFromSupabase,
  fetchToolsByCategoryFromSupabase,
} from "@/lib/supabase/catalog";

export type { Category, Tool };

export async function fetchAllTools(): Promise<Tool[]> {
  return fetchAllToolsFromSupabase();
}

export async function fetchToolsByCategory(categorySlug: string): Promise<Tool[]> {
  return fetchToolsByCategoryFromSupabase(categorySlug);
}

export async function fetchToolBySlug(slug: string): Promise<Tool | null> {
  return fetchToolBySlugFromSupabase(slug);
}

export async function fetchAllCategories(): Promise<Category[]> {
  return fetchAllCategoriesFromSupabase();
}
