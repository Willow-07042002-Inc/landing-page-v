// Server-only helpers for the Willow marketing serverless functions.
//
// This runs on Vercel (Node), never in the browser, so it may hold the
// service-role key. Only the nightly digest needs it: reading marketing leads
// back out requires privileges the public key deliberately does not have.
// Sign-ups themselves are written straight from the browser with the
// publishable key, which the "Allow public insert" policy permits.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function adminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
