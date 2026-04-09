"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-white text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-[#A0A0A0] mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-[#8468EB] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7459d4] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
