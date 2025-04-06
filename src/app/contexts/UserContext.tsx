'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface UserData {
  id: string
  email: string
  name?: string
}

const UserContext = createContext<UserData | null>(null)

export const useUserData = () => useContext(UserContext)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('user in provider', user)
      if (user) {
        setUserData({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.name ?? ''
        })
      }
    }

    getUser()
  }, [])

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  )
}
