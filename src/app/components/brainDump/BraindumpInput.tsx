'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

export default function BrainDumpInput() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/braindump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save brain dump')
      }

      setContent('')
    } catch (error) {
      console.error('Error saving brain dump:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Just dump it here, no judgment. Get it out of your head..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
        {loading ? 'Saving...' : '➕ Add Thought'}
      </Button>
    </div>
  )
}
