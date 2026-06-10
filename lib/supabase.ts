import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.warn(
    "[supabase] SUPABASE_URL or SUPABASE_SERVICE_KEY not set — dispatch features will be unavailable."
  );
}

export const supabaseAdmin = createClient(url ?? "", key ?? "", {
  auth: { persistSession: false },
});
