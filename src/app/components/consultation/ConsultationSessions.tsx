'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionSchema } from '@/app/lib/schemas/session'

export default function ConsultationSessions() {
  const [sessions, setSessions] = useState<SessionSchema[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch user's sessions on component mount
  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      try {
        const res = await fetch('/api/session')
        if (!res.ok) {
          throw new Error('Failed to fetch sessions')
        }
        const data = await res.json()
        setSessions(data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  // Handle creation of a new session
  async function handleNewSession() {
    setLoading(true)
    try {
      // Here, you may pass initial parameters (e.g., mood or title) if you have them
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mood: null, // or default mood value
          title: null // or default title value
        })
      })
      if (!res.ok) {
        throw new Error('Failed to create session')
      }
      const newSession = await res.json()
      // Navigate to the consultation page for this session.
      // For example, you might have a route like /consultation/[sessionId]
      router.push(`/consultation/${newSession.id}`)
    } catch (error) {
      console.error('Error creating session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Begin Your Healing Journey Here 👉</h2>
        <button 
          onClick={handleNewSession} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
        >
          {loading ? 'Processing...' : 'Start New Session'}
        </button>
      </div>
      
      {loading && sessions.length === 0 ? (
        <p className="text-gray-600">Loading sessions...</p>
      ) : (
        <ul className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.id} className="p-4 border rounded shadow-sm hover:shadow-md transition">
                <h2 className="text-xl font-semibold">
                  {session.title || 'Untitled Consultation'}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(session.started_at).toLocaleString()}
                </p>
                {session.summary && (
                  <p className="mt-2 text-gray-700">{session.summary}</p>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-600">No sessions found. Start a new one!</p>
          )}
        </ul>
      )}
    </div>
  )
}
