'use client'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2">Something went wrong. Please try again.</p>
      </div>
    </div>
  )
}