'use client'

import { useUserData } from '../../contexts/UserContext'

export default function UserGreeting() {
  const { userData, isLoading } = useUserData()
  console.log('userData in greeting', userData)

  if (isLoading) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {userData?.name || userData?.email || 'friend'} 👋
      </h1>
      <p className="text-muted-foreground">How can I help lighten your mind today?</p>
    </div>
  )
}
