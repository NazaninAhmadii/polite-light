'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useUserData } from '../../contexts/UserContext'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatSupportCard() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { userData } = useUserData()

  const sendMessage = async () => {
    if (!input.trim()) return

    // Append user's message to the conversation history.
    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Clear the input.
    setInput('')
    setSubmitting(true)

    // Send the current conversation (or at least the latest message) to your API.
    // Optionally you may also send conversation history for richer context.
    const res = await fetch('/api/sessionentries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: userMessage.content,
        mood: null, // You may choose to remove mood here or handle it differently per message.
        // If you are handling a true consultation, you might rely on a session-based approach.
        user_id: userData?.id,
        conversation: updatedMessages
      })
    })

    const data = await res.json()
    // Append the AI's response.
    const aiMessage: Message = { role: 'assistant', content: data.ai_response }
    setMessages((prev) => [...prev, aiMessage])
    setSubmitting(false)
  }

  return (
    <div className="rounded-2xl shadow-md mx-auto p-4 bg-white">
      {/* Chat window */}
      <div className="mb-4 h-64 overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-600 italic">Your consultation will appear here...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
              <span className="font-semibold">
                {msg.role === 'assistant' ? 'Polite Light' : 'You'}:
              </span>
              <p>{msg.content}</p>
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
          className="flex-1"
        />
        <Button disabled={submitting} onClick={sendMessage}>
          {submitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
