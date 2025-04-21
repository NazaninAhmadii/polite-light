import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server"

// POST: Create a new session
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    
        // Parse the request body
        const body = await request.json()
        const { mood, title, summary } = body
    
        // Insert a new session
        const { data, error: insertError } = await supabase
            .from('sessions')
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
    
        return NextResponse.json(data[0], { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}