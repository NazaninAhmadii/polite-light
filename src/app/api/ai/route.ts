import { NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY, // Make sure you have this in your .env.local
      temperature: 0.7 // Creative but not too random
    })

    const response = await chat.invoke([
      new HumanMessage(message)
    ])

    return NextResponse.json({ response: response.content })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 })
  }
}
