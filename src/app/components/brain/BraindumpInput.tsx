'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useUserData } from '../../contexts/UserContext'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function BrainDumpInput() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useUserData()
  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)

    const { error } = await supabase.from('brain_dumps').insert({
      user_id: user?.id,
      content,
      ai_summary: null,
      ai_tags: null
    })

    if (error) {
      console.error('Error saving brain dump:', error)
    } else {
      setContent('')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write anything that’s on your mind..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
        {loading ? 'Saving...' : '➕ Add Thought'}
      </Button>
    </div>
  )
}
