'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

const moods = ['😔', '😐', '🙂', '😊', '❤️‍🔥']

export default function SoloSupportCard() {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [response, setResponse] = useState('')

  const handleSubmit = async () => {
    if (!content || !mood) return
    setSubmitting(true)

    const res = await fetch('/api/emotion-entry', {
      method: 'POST',
      body: JSON.stringify({ content, mood }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    setResponse(data.ai_response)
    setSubmitting(false)
  }

  return (
    <div className="rounded-2xl shadow-md mx-auto">
      <Textarea
        placeholder="“I’m here for you. Let’s unpack this together...”"
        className="mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        {moods.map((emoji, i) => (
          <span
            key={i}
            onClick={() => setMood(emoji)}
            className={`text-2xl cursor-pointer transition hover:scale-110 ${
              mood === emoji ? 'ring-2 ring-orange-400 rounded-full' : ''
            }`}
          >
            {emoji}
          </span>
        ))}
      </div>

      <Button disabled={submitting} onClick={handleSubmit}>
        {submitting ? 'Sending...' : '🧡 Submit'}
      </Button>

      {response && (
        <div className="mt-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
          <p className="italic text-orange-800 dark:text-orange-300">
            {response}
          </p>
        </div>
      )}
    </div>
  )
}
