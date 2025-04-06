'use client'

import { useUserData } from '../../contexts/UserContext'

export default function UserGreeting() {
  const user = useUserData()
  console.log('user', user)

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.name || user?.email || 'friend'} 👋
      </h1>
      <p className="text-muted-foreground">How can I help lighten your mind today?</p>
    </div>
  )
}
