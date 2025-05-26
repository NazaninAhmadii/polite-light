'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionSchema } from '@/app/lib/schemas/session'
import SessionInputCard from '@/app/components/sessionDetails/SessionInputCard'
import EndSessionDialog from '@/app/components/sessionDetails/EndSessionDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Pencil } from 'lucide-react'
import { UserProvider } from '@/app/contexts/UserContext'
import { MOOD_OPTIONS, type MoodValue } from '@/app/lib/schemas/mood'

export default function ConsultationSession() {
  const { sessionId } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<SessionSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedMood, setEditedMood] = useState('')

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/session/${sessionId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch session')
        }
        const data = await res.json()
        setSession(data)
        setEditedTitle(data.title || '')
        setEditedMood(data.mood || '')
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

  // Handle title and mood update
  async function handleUpdate() {
    try {
      const res = await fetch(`/api/session/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          mood: editedMood,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update session')
      }

      const updatedSession = await res.json()
      setSession(updatedSession)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading session...</div>
  }

  if (!session) {
    return <div className="p-4">Session not found</div>
  }

  return (
    <UserProvider>
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
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded"
                  placeholder="Enter session title"
                />
              ) : (
                <CardTitle>💬 {session.title || 'Untitled Consultation'}</CardTitle>
              )}
              <button
                onClick={() => {
                  if (isEditing) {
                    handleUpdate()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {MOOD_OPTIONS.map(({ emoji, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setEditedMood(value)
                    if (isEditing) {
                      handleUpdate()
                    }
                  }}
                  className={`p-2 rounded-full hover:bg-gray-100 ${
                    (isEditing ? editedMood : session.mood) === value
                      ? 'bg-gray-200'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            <p className="text-gray-600">
              Started: {new Date(session.started_at).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <SessionInputCard sessionId={sessionId as string} emotionalMood={editedMood as MoodValue}/>
          </CardContent>
        </Card>
        {session.summary && (
          <div className="bg-gray-50 p-4 rounded mt-4">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p>{session.summary}</p>
          </div>
        )}

        <EndSessionDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={() => handleDialogAction(true)}
        />
      </div>
    </UserProvider>
  )
} 