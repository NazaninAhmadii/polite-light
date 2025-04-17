import { z } from 'zod'

export const sessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  mood: z.string().optional(),
  title: z.string().optional(),
  started_at: z.string(),
  updated_at: z.string(),
  ended_at: z.string().optional(),
  is_active: z.boolean(),
  summary: z.string().optional(),
})

export type SessionSchema = z.infer<typeof sessionSchema>