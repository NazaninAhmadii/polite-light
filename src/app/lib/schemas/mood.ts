import { z } from 'zod'
import { Smile, Meh, Frown } from 'lucide-react'

export const moodSchema = z.object({
  emoji: z.string(),
  value: z.enum(['happy', 'neutral', 'sad']),
  icon: z.any() // Since Lucide icons are components, we can't strictly type them
})

export const moodOptionsSchema = z.array(moodSchema)

export const MOOD_OPTIONS = [
  { emoji: '😊', value: 'happy', icon: Smile },
  { emoji: '😐', value: 'neutral', icon: Meh },
  { emoji: '😔', value: 'sad', icon: Frown },
] as const

// Validate the constant against the schema
moodOptionsSchema.parse(MOOD_OPTIONS)

// Export types
export type Mood = z.infer<typeof moodSchema>
export type MoodValue = z.infer<typeof moodSchema>['value'] 