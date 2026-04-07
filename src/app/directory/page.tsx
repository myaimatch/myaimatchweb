import type { Metadata } from "next"
import { fetchAllTools, fetchAllCategories } from "@/lib/airtable"
import DirectoryClient from "@/components/DirectoryClient"

export const metadata: Metadata = {
  title: "AI Tools Directory | myAIMatch",
  description:
    "Browse and discover the best AI tools across every category. Filter by use case, pricing model, and rating to find the perfect tool for your workflow.",
  openGraph: {
    title: "AI Tools Directory | myAIMatch",
    description:
      "Browse and discover the best AI tools across every category. Filter by use case, pricing model, and rating to find the perfect tool for your workflow.",
    url: "https://myaimatch.ai/directory",
    siteName: "myAIMatch",
    type: "website",
  },
}

export default async function DirectoryPage() {
  const [tools, categories] = await Promise.all([fetchAllTools(), fetchAllCategories()])

  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name
  }

  return (
    <main className="bg-[#131313] min-h-screen text-white">
      {/* Hero */}
      <section className="px-4 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
          AI Tools <span className="text-[#8468EB]">Directory</span>
        </h1>
        <p className="text-lg text-[#A0A0A0] max-w-xl mx-auto mb-10">
          {tools.length} tools across {categories.length} categories — find exactly what you need.
        </p>
      </section>

      {/* Filters + grid */}
      <DirectoryClient tools={tools} categories={categories} categoryMap={categoryMap} />
    </main>
  )
}
