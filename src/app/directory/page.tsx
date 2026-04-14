import type { Metadata } from "next"
import { fetchAllTools, fetchAllCategories } from "@/lib/airtable"
import DirectoryClient from "@/components/DirectoryClient"

// Keep Airtable-backed directory fresh and avoid baking live data into static output.
export const dynamic = 'force-dynamic'

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
    <main className="bg-[#0d0d0d] min-h-screen text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 text-center border-b border-[#1a1a1a]">
        {/* Orb 1 */}
        <div style={{position:"absolute",top:"-60px",left:"50%",transform:"translateX(-50%)",width:"700px",height:"350px",background:"radial-gradient(ellipse 60% 60% at 50% 30%, rgba(129,74,200,0.28) 0%, transparent 70%)",animation:"orbPulse 8s ease-in-out infinite",pointerEvents:"none"}} />
        {/* Orb 2 */}
        <div style={{position:"absolute",top:"-100px",left:"50%",transform:"translateX(-50%)",width:"900px",height:"450px",background:"radial-gradient(ellipse 70% 65% at 50% 28%, rgba(129,74,200,0.09) 0%, transparent 65%)",animation:"orbPulse2 11s 1.5s ease-in-out infinite",pointerEvents:"none"}} />
        {/* Bottom fade */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"60px",background:"linear-gradient(to bottom, transparent, #0d0d0d)",pointerEvents:"none"}} />

        <div className="relative">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
            AI Tools <span className="text-[#814ac8]">Directory</span>
          </h1>
          <p className="text-base text-[#888] max-w-2xl mx-auto leading-relaxed">
            Cut through the noise. Compare AI tools side-by-side with real data, objective scores, and category-specific benchmarks — so you always pick the right tool.
          </p>
        </div>
      </section>

      {/* Table + filters */}
      <DirectoryClient tools={tools} categories={categories} categoryMap={categoryMap} />
    </main>
  )
}
