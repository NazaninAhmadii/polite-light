import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { createClient } from '@/app/utils/supabase/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
})

const CACHE_TTL = 60 * 5 // 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Get the IP address from the request
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      )
    }

    // Try to get from cache first
    const cachedSession = await redis.get(`session:${params.sessionId}`)
    if (cachedSession) {
      return NextResponse.json(cachedSession)
    }

    // If not in cache, fetch from database
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', params.sessionId)
      .single()

    if (error) {
      throw error
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Cache the session
    await redis.set(`session:${params.sessionId}`, session, {
      ex: CACHE_TTL
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, mood, summary } = await request.json()

    const { data: session, error } = await supabase
      .from('sessions')
      .update({
        title,
        mood,
        summary,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Clear the cache for this session
    await redis.del(`session:${params.sessionId}`)

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 