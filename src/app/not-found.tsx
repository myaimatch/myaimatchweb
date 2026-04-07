import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-white text-6xl font-bold mb-4">404</h1>
        <p className="text-[#A0A0A0] mb-6">Page not found.</p>
        <Link
          href="/"
          className="bg-[#8468EB] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7459d4] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
