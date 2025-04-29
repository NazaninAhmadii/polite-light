import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split('; ').map(cookie => {
            const [name, value] = cookie.split('=')
            return { name, value }
          })
        },
        setAll(cookies: { name: string; value: string }[]) {
          cookies.forEach(({ name, value }) => {
            document.cookie = `${name}=${value}; path=/`
          })
        }
      }
    }
  )
}