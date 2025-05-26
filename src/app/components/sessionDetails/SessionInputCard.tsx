'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useUserData } from '../../contexts/UserContext'
import { type MoodValue } from '@/app/lib/schemas/mood'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatSupportCard({ sessionId, emotionalMood }: { sessionId: string, emotionalMood: MoodValue }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { userData } = useUserData()

  const sendMessage = async () => {
    if (!input.trim()) return

    // Append user's message to the conversation history
    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Clear the input
    setInput('')
    setSubmitting(true)

    try {
      // First get AI response
      const aiResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!aiResponse.ok) {
        throw new Error('Failed to get AI response')
      }

      const { response } = await aiResponse.json()

      // Then save the conversation to the database
      const res = await fetch('/api/sessionentries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage.content,
          emotional_state: emotionalMood,
          user_id: userData?.id,
          session_id: sessionId,
          ai_response: response
        })
      })

      if (!res.ok) {
        throw new Error('Failed to save conversation')
      }

      // Append the AI's response to the chat
      const aiMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      // Optionally show an error message to the user
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl shadow-md mx-auto p-2 bg-slate-900">
      {/* Chat window */}
      <div className="mb-4 h-64 overflow-y-auto p-4 rounded bg-slate-950 border border-slate-800">
        {messages.length === 0 ? (
          <p className="text-gray-300 italic">Your consultation will appear here...</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg ${
                msg.role === 'assistant' 
                  ? 'bg-indigo-950 text-indigo-100' 
                  : 'bg-slate-800 text-gray-100'
              }`}
            >
              <span className="font-semibold">
                {msg.role === 'assistant' ? 'Polite Light' : 'You'}:
              </span>
              <p className="mt-1">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950 text-gray-100 border-slate-800 placeholder:text-gray-400 focus-visible:ring-slate-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <Button disabled={submitting || !input.trim()} onClick={sendMessage}>
          {submitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
