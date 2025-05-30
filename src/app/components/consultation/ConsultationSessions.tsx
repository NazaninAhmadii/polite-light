'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionSchema } from '@/app/lib/schemas/session'

const ITEMS_PER_PAGE = 10

export default function ConsultationSessions() {
  const [sessions, setSessions] = useState<SessionSchema[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()

  // Fetch user's sessions on component mount and page change
  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      try {
        const res = await fetch(`/api/sessions?page=${page}&limit=${ITEMS_PER_PAGE}`)
        if (!res.ok) {
          throw new Error('Failed to fetch sessions')
        }
        const data = await res.json()
        setSessions(prev => page === 1 ? data.sessions : [...prev, ...data.sessions])
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [page])

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
      router.push(`/session/${newSession.id}`)
    } catch (error) {
      console.error('Error creating session:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle infinite scroll
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop === 
      document.documentElement.offsetHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  return (
    <div className="max-w-2xl space-y-4">
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
        <ul className="space-y-2">
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
      {loading && sessions.length > 0 && (
        <p className="text-center text-gray-600 mt-4">Loading more sessions...</p>
      )}
    </div>
  )
}
