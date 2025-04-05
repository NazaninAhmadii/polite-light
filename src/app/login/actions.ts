'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { authSchema } from '../lib/schemas/auth'
import { createClient } from '../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    throw new Error('Invalid fields')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  
  console.log('Form values:', { email, password })

  const validatedFields = authSchema.safeParse({
    email,
    password,
  })

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error)
    throw new Error('Invalid fields')
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}