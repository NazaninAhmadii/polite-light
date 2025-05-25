import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { createClient } from '@/app/utils/supabase/server'

// // Initialize Redis client
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// })

// // Initialize rate limiter
// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(100, '1 m'),
// })

const CACHE_TTL = 60 * 5 // 5 minutes

export async function GET(request: Request) {
    try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Get the IP address from the request
    // const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // // Check rate limit
    // const { success } = await ratelimit.limit(ip)
    // if (!success) {
    //   return NextResponse.json(
    //     { error: 'Too many requests' },
    //     { status: 429 }
    //   )
    // }

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // // Try to get from cache first
    // const cacheKey = `sessions:${page}:${limit}`
    // const cachedSessions = await redis.get(cacheKey)
    // if (cachedSessions) {
    //   return NextResponse.json(cachedSessions)
    // }

    // Fetch sessions with pagination for the current user
    const { data: sessions, error, count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    const response = {
      sessions,
      hasMore: offset + limit < (count || 0),
      total: count
    }

    // // Cache the response
    // await redis.set(cacheKey, response, {
    //   ex: CACHE_TTL
    // })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 