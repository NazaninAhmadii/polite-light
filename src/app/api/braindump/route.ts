import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const cookieStore = cookies()
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
    cookies: {
        getAll() {
        return cookieStore.getAll()
        }
    }
    }
)

export async function GET() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: brainDumps, error: brainDumpsError } = await supabase
        .from('brain_dumps')
        .select('*')
        .eq('user_id', user.id)

    if (brainDumpsError) {
        return NextResponse.json({ error: brainDumpsError.message }, { status: 500 })
    }

        return NextResponse.json(brainDumps, { status: 200 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}
export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Auth error' }, { status: 401 })
    }

    if (!user) {
      console.error('No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('brain_dumps').insert({
      user_id: user.id,
      content,
      ai_summary: null,
      ai_tags: null
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