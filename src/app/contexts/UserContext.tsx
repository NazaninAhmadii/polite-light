'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

interface UserData {
  id: string
  email: string
  name?: string
}

interface UserContextType {
  userData: UserData | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({ userData: null, isLoading: true })

export const useUserData = () => useContext(UserContext)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = React.useMemo(
    () =>
      createBrowserClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_API_KEY!
      ),
    []
  )

  useEffect(() => {
    const updateUserData = (user: User | null) => {
      if (user) {
        setUserData({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.name ?? ''
        })
      } else {
        setUserData(null)
      }
      setIsLoading(false)
    }

    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        updateUserData(user)

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('session', session)
          updateUserData(session?.user ?? null)
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase])

  return (
    <UserContext.Provider value={{ userData, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}
