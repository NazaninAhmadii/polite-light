import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const cookieStore = cookies()
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        getAll() {
            return cookieStore.getAll()
        }
    } }
)

export async function GET() {
    // Get the authenticated user from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Query the user_sessions table for sessions belonging to this user
  const { data: sessions, error: sessionError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', user.id)
  
  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 })
  }

  return NextResponse.json(sessions, { status: 200 })
}

// POST: Create a new session
export async function POST(request: Request) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    // Parse the request body. Expecting JSON with optional mood and title.
    const body = await request.json()
    const { mood, title, summary } = body
  
    // Insert a new session for this user in the user_sessions table
    const { data, error: insertError } = await supabase
      .from('user_sessions')
      .insert([{
        user_id: user.id,
        mood: mood ?? null,
        title: title ?? null,
        summary: summary ?? null
      }])
      .select()
  
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  
    // Return the newly created session (typically the first element)
    return NextResponse.json(data[0], { status: 201 })
  }