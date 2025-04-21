'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SessionSchema } from '@/app/lib/schemas/session'
import SessionInputCard from '@/app/components/sessionDetails/SessionInputCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export default function ConsultationSession() {
  const { sessionId } = useParams()
  const [session, setSession] = useState<SessionSchema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/session/${sessionId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch session')
        }
        const data = await res.json()
        setSession(data)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  if (loading) {
    return <div className="p-4">Loading session...</div>
  }

  if (!session) {
    return <div className="p-4">Session not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
         <Card>
          <CardHeader>
            <CardTitle>💬 {session.title || 'Untitled Consultation'}</CardTitle>
            <p className="text-gray-600">
              Started: {new Date(session.started_at).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <SessionInputCard />
          </CardContent>
        </Card>
        {session.summary && (
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p>{session.summary}</p>
          </div>
        )}
    </div>
  )
} 