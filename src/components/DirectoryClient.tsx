"use client"

import { useState, useMemo } from "react"
import { Search, Star } from "lucide-react"
import type { AirtableTool, AirtableCategory } from "@/lib/airtable"

interface Props {
  tools: AirtableTool[]
  categories: AirtableCategory[]
  categoryMap: Record<string, string>
}

export default function DirectoryClient({ tools, categories, categoryMap }: Props) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredTools = useMemo(() => {
    let result = tools
    if (activeCategory) {
      result = result.filter((t) => t.category.includes(activeCategory))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(q))
    }
    return result
  }, [tools, activeCategory, search])

  return (
    <div className="px-4 pb-24">
      {/* Search */}
      <div className="max-w-2xl mx-auto relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] w-4 h-4" />
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#232323] border border-[#343434] text-white placeholder-[#A0A0A0] rounded-full pl-12 pr-6 py-4 text-base outline-none focus:border-[#8468EB] focus:ring-1 focus:ring-[#8468EB] transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-[#8468EB] text-white"
              : "bg-[#232323] border border-[#343434] text-[#A0A0A0] hover:border-[#8468EB] hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-[#8468EB] text-white"
                : "bg-[#232323] border border-[#343434] text-[#A0A0A0] hover:border-[#8468EB] hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-20 text-[#A0A0A0]">
          <p className="text-lg font-medium text-white mb-2">No tools found</p>
          <p className="text-sm">Try a different search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} categoryMap={categoryMap} />
          ))}
        </div>
      )}
    </div>
  )
}

function ToolCard({
  tool,
  categoryMap,
}: {
  tool: AirtableTool
  categoryMap: Record<string, string>
}) {
  const initials = tool.name.slice(0, 2).toUpperCase()
  const categoryName = tool.category[0] ? categoryMap[tool.category[0]] : null

  return (
    <div className="bg-[#2F2F2F] rounded-2xl border border-[#343434] hover:border-[#8468EB] transition-all p-5 flex flex-col gap-4">
      {/* Logo + name row */}
      <div className="flex items-center gap-3">
        {tool.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.logoUrl}
            alt={tool.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl object-contain bg-[#232323] flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#343434] text-[#8468EB] font-bold text-sm flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
        )}
        <span className="text-white font-semibold text-base leading-snug">{tool.name}</span>
      </div>

      {/* Description */}
      <p className="text-[#A0A0A0] text-sm leading-relaxed line-clamp-2 flex-1">
        {tool.shortDescription}
      </p>

      {/* Badges + rating */}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        {categoryName && (
          <span className="bg-[#8468EB]/20 text-[#8468EB] text-xs font-medium px-3 py-1 rounded-full">
            {categoryName}
          </span>
        )}
        {tool.pricingModel && (
          <span className="bg-[#343434] text-[#A0A0A0] text-xs font-medium px-3 py-1 rounded-full">
            {tool.pricingModel}
          </span>
        )}
        {tool.publicRating != null && (
          <span className="flex items-center gap-1 text-[#A0A0A0] text-xs ml-auto">
            <Star className="w-3 h-3 text-[#8468EB] fill-[#8468EB]" />
            {tool.publicRating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  )
}
