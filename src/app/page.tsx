'use client'

import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import Greeting from './components/user/Greeting'
import BrainDumpInput from './components/brainDump/BraindumpInput'
import SessionInputCard from './components/sessionDetails/SessionInputCard'
import { UserProvider } from './contexts/UserContext'
import ConsultationSessions from './components/consultation/ConsultationSessions'

export default function Home() {
  return (
    <UserProvider>
      <main className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <section>
          <Greeting />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>🧠 Brain Dump</CardTitle>
          </CardHeader>
          <CardContent>
            <BrainDumpInput />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💬 Consultation Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsultationSessions />
          </CardContent>
        </Card>
      </main>
    </UserProvider>
  )
}
