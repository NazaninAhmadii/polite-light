'use client'

import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Button } from './components/ui/button'
import Greeting from './components/user/Greeting'
import BrainDumpInput from './components/brain/BraindumpInput'
import { UserProvider } from './contexts/UserContext'

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
            <CardTitle>💬 Emotional Support</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="How are you feeling today?" className="mb-4" />
            <div className="flex gap-2 mb-4">
              {['😔', '😐', '🙂', '😊', '❤️‍🔥'].map((emoji, i) => (
                <span key={i} className="text-2xl cursor-pointer hover:scale-110 transition">
                  {emoji}
                </span>
              ))}
            </div>
            <Button>🧡 Submit</Button>
          </CardContent>
        </Card>
      </main>
    </UserProvider>
  )
}
