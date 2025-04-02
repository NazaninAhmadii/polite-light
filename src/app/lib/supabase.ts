import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseApiKey = process.env.SUPABASE_API_KEY as string

export const supabase = createClient(supabaseUrl, supabaseApiKey)
