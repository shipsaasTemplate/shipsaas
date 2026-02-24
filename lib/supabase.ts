import { createClient } from "@supabase/supabase-js";

// ===========================================
// Supabase Client
// ===========================================
// Add these to your .env.local:
//   SUPABASE_URL=https://your-project.supabase.co
//   SUPABASE_KEY=your-anon-key
//
// Get your credentials from: https://supabase.com/dashboard/project/_/settings/api
// ===========================================

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default supabase;
