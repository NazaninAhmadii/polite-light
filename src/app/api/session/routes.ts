import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()
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
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}

// POST: Create a new session
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
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
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}