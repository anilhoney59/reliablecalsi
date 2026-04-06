import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey  = process.env.SUPABASE_SECRET_KEY      ?? "";

// Server-side client using the Secret key (bypasses RLS — never expose client-side)
export const supabase = createClient(supabaseUrl, supabaseKey);
