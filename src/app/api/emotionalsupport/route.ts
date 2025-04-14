import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: cookieStore }
    )   
    
    const { content, mood, user_id } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json({ error: 'Auth error' }, { status: 401 })
    }

    if (!user) {
        console.error('No user found')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('emotional_entries').insert({
        content,
        mood,
        user_id
    })

    if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }) 
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    )
  }
}