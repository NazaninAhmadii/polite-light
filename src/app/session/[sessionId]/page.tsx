'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionSchema } from '@/app/lib/schemas/session'
import SessionInputCard from '@/app/components/sessionDetails/SessionInputCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export default function ConsultationSession() {
  const { sessionId } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<SessionSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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

  // Handle back button click
  function handleBackClick() {
    setShowConfirmDialog(true)
  }

  // Handle confirmation dialog actions
  async function handleDialogAction(confirm: boolean) {
    if (confirm) {
      try {
        // End the session
        const res = await fetch(`/api/session/${sessionId}/end`, {
          method: 'POST',
        })
        if (!res.ok) {
          throw new Error('Failed to end session')
        }
      } catch (error) {
        console.error('Error ending session:', error)
      }
      router.push('/')
    }
    setShowConfirmDialog(false)
  }

  if (loading) {
    return <div className="p-4">Loading session...</div>
  }

  if (!session) {
    return <div className="p-4">Session not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 flex items-center"
        >
          <span className="mr-2">←</span> Back to Home
        </button>
      </div>

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
        <div className="bg-gray-50 p-4 rounded mt-4">
          <h2 className="font-semibold mb-2">Summary</h2>
          <p>{session.summary}</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">End Session?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this session? Any unsaved progress will be lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleDialogAction(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDialogAction(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 