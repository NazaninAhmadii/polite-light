'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { authSchema } from '../lib/schemas/auth'
import { createClient } from '../utils/supabase/server'

async function validateAuthData(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const validatedFields = authSchema.safeParse({
    email,
    password,
  })

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error)
    redirect('/error')
  }

  return validatedFields.data
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { email, password } = await validateAuthData(formData)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('Auth error:', error)
    redirect('/error')
  }

  revalidatePath('/')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const { email, password } = await validateAuthData(formData)

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/')
  redirect('/')
}