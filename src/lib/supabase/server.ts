import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return !!supabaseUrl && !!supabaseAnonKey;
}

export function hasSupabaseServiceConfig() {
  return hasSupabaseConfig() && !!supabaseServiceRoleKey;
}

export function getSupabaseDataClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseAdminClient(): SupabaseClient {
  const client = getSupabaseDataClient();
  if (!client || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase service configuration");
  }
  return client;
}

export function createSupabaseAuthServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always set cookies; route handlers can.
        }
      },
    },
  });
}
