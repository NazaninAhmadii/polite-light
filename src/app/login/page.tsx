'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { login, signup } from './actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { formSchema, type FormSchema } from '../lib/schemas/form'

export default function LoginPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to your account
          </p>
        </div>
        <Form {...form}>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full bg-background text-foreground placeholder:text-muted-foreground"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password"
                        className="w-full bg-background text-foreground placeholder:text-muted-foreground"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button 
                formAction={login} 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
              <Button 
                formAction={signup} 
                type="submit"
                variant="outline"
                className="w-full bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
