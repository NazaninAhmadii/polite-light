import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: emotionalEntries, error: emotionalEntriesError } = await supabase
            .from('emotional_entries')
            .select('*')
            .eq('user_id', user.id)

        if (emotionalEntriesError) {
            return NextResponse.json({ error: emotionalEntriesError.message }, { status: 500 })
        }

        return NextResponse.json(emotionalEntries, { status: 200 })
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
        const supabase = await createClient()
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