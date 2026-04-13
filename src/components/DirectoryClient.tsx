"use client"

import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  SlidersHorizontal,
  X,
  Star,
  ArrowUpRight,
  Bookmark,
  ChevronRight,
} from "lucide-react"
import type { AirtableTool, AirtableCategory } from "@/lib/airtable"

const SearchBar = dynamic(
  () => import("@/components/ui/search-bar").then((m) => ({ default: m.SearchBar })),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 rounded-lg bg-white/5 border border-white/10 animate-pulse w-56" />
    ),
  }
)

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  tools: AirtableTool[]
  categories: AirtableCategory[]
  categoryMap: Record<string, string>
}

type SortField = "name" | "category" | "pricingModel" | "publicRating" | "maimScore" | "bestFor" | null
type SortDir = "asc" | "desc"

interface ActiveFilters {
  pricingModels: string[]
  minRating: number | null
  minMaimScore: number | null
  featuredOnly: boolean
  supportLanguages: string[]
  hasFreePlan: boolean | null
  bestFor: string[]
  hasApi: boolean | null
  companyHq: string[]
  gdprCompliant: boolean | null
}

const DEFAULT_FILTERS: ActiveFilters = {
  pricingModels: [],
  minRating: null,
  minMaimScore: null,
  featuredOnly: false,
  supportLanguages: [],
  hasFreePlan: null,
  bestFor: [],
  hasApi: null,
  companyHq: [],
  gdprCompliant: null,
}

function countActiveFilters(f: ActiveFilters) {
  let n = 0
  if (f.pricingModels.length) n++
  if (f.minRating) n++
  if (f.minMaimScore) n++
  if (f.featuredOnly) n++
  if (f.supportLanguages.length) n++
  if (f.hasFreePlan !== null) n++
  if (f.bestFor.length) n++
  if (f.hasApi !== null) n++
  if (f.companyHq.length) n++
  if (f.gdprCompliant !== null) n++
  return n
}

// ─── useFavorites hook ────────────────────────────────────────────────────────

function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem("maim_favorites")
      return new Set(stored ? JSON.parse(stored) : [])
    } catch {
      return new Set()
    }
  })

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem("maim_favorites", JSON.stringify(Array.from(next)))
      return next
    })
  }, [])

  return { favorites, toggle }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DirectoryClient({ tools, categories, categoryMap }: Props) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(DEFAULT_FILTERS)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favorites, toggle: toggleFavorite } = useFavorites()
  // fetchedAt intentionally unused in display for now (badge always shows "just now")
  const [] = useState(() => new Date())

  // Unique pricing models from all tools
  const pricingOptions = useMemo(() => {
    const set = new Set<string>()
    tools.forEach((t) => {
      if (t.pricingModel) set.add(t.pricingModel)
    })
    return Array.from(set).sort()
  }, [tools])

  // Tool count per category (for category cards)
  const toolCountByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    tools.forEach((t) => {
      t.category.forEach((catId) => {
        map[catId] = (map[catId] ?? 0) + 1
      })
    })
    return map
  }, [tools])

  // Subcategories available in the currently selected category
  const availableSubcategories = useMemo(() => {
    if (!activeCategory) return []
    const set = new Set<string>()
    tools.forEach((t) => {
      if (t.category.includes(activeCategory) && t.subcategory) {
        set.add(t.subcategory)
      }
    })
    return Array.from(set).sort()
  }, [tools, activeCategory])

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortField(field)
        setSortDir("asc")
      }
    },
    [sortField]
  )

  const handleCategorySelect = useCallback(
    (catId: string | null) => {
      setActiveCategory(catId)
      setActiveSubcategory(null) // reset subcategory on category change
    },
    []
  )

  const filteredTools = useMemo(() => {
    let result = tools

    // 1. Category
    if (activeCategory) {
      result = result.filter((t) => t.category.includes(activeCategory))
    }
    // 2. Subcategory
    if (activeSubcategory) {
      result = result.filter((t) => t.subcategory === activeSubcategory)
    }
    // 3. Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.shortDescription ?? "").toLowerCase().includes(q)
      )
    }
    // 4. Sidebar filters
    if (activeFilters.pricingModels.length) {
      result = result.filter(
        (t) => t.pricingModel && activeFilters.pricingModels.includes(t.pricingModel)
      )
    }
    if (activeFilters.minRating != null) {
      result = result.filter((t) => (t.publicRating ?? 0) >= activeFilters.minRating!)
    }
    if (activeFilters.minMaimScore != null) {
      result = result.filter((t) => (t.maimScore ?? 0) >= activeFilters.minMaimScore!)
    }
    if (activeFilters.featuredOnly) {
      result = result.filter((t) => t.featured)
    }
    // 5. New enriched filters
    if (activeFilters.supportLanguages.length) {
      result = result.filter((t) =>
        t.supportLanguages?.some((lang) => activeFilters.supportLanguages.includes(lang))
      )
    }
    if (activeFilters.hasFreePlan !== null) {
      result = result.filter((t) => (t.hasFreePlan ?? false) === activeFilters.hasFreePlan)
    }
    if (activeFilters.bestFor.length) {
      result = result.filter((t) => t.bestFor && activeFilters.bestFor.includes(t.bestFor))
    }
    if (activeFilters.hasApi !== null) {
      result = result.filter((t) => (t.hasApi ?? false) === activeFilters.hasApi)
    }
    if (activeFilters.companyHq.length) {
      result = result.filter((t) => t.companyHq && activeFilters.companyHq.includes(t.companyHq))
    }
    if (activeFilters.gdprCompliant !== null) {
      result = result.filter((t) => (t.gdprCompliant ?? false) === activeFilters.gdprCompliant)
    }
    // 6. Favorites only
    if (showFavoritesOnly) {
      result = result.filter((t) => favorites.has(t.id))
    }
    // 6. Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let aVal: string | number = ""
        let bVal: string | number = ""

        if (sortField === "name") {
          aVal = a.name
          bVal = b.name
        } else if (sortField === "category") {
          aVal = a.category[0] ? (categoryMap[a.category[0]] ?? "") : ""
          bVal = b.category[0] ? (categoryMap[b.category[0]] ?? "") : ""
        } else if (sortField === "pricingModel") {
          aVal = a.pricingModel ?? ""
          bVal = b.pricingModel ?? ""
        } else if (sortField === "publicRating") {
          aVal = a.publicRating ?? 0
          bVal = b.publicRating ?? 0
        } else if (sortField === "maimScore") {
          aVal = a.maimScore ?? 0
          bVal = b.maimScore ?? 0
        } else if (sortField === "bestFor") {
          aVal = a.bestFor ?? ""
          bVal = b.bestFor ?? ""
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal
        }
        const aStr = String(aVal)
        const bStr = String(bVal)
        return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    return result
  }, [
    tools,
    activeCategory,
    activeSubcategory,
    search,
    activeFilters,
    showFavoritesOnly,
    favorites,
    sortField,
    sortDir,
    categoryMap,
  ])

  const filterCount = countActiveFilters(activeFilters)

  return (
    <div className="relative">
      {/* ── Category Cards ─────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] pt-5 pb-0">
        <div className="relative">
          {/* Left fade mask */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, #0d0d0d, transparent)" }}
          />
          {/* Right fade mask */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, #0d0d0d, transparent)" }}
          />

          <div
            className="flex gap-3 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* All Tools card */}
            <CategoryCard
              id={null}
              name="All Tools"
              description="Browse the full AI tools catalog"
              icon="✦"
              count={tools.length}
              active={activeCategory === null}
              onClick={() => handleCategorySelect(null)}
            />
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                description={cat.description ?? "Explore tools in this category"}
                icon={cat.icon ?? "🤖"}
                count={toolCountByCategory[cat.id] ?? 0}
                active={activeCategory === cat.id}
                onClick={() =>
                  handleCategorySelect(activeCategory === cat.id ? null : cat.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Subcategory chips — animates in when a category is selected */}
        <AnimatePresence>
          {activeCategory && availableSubcategories.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2 px-6 py-3 overflow-x-auto border-t"
                style={{
                  borderColor: "#1a1a1a",
                  scrollbarWidth: "none",
                  background: "rgba(129,74,200,0.03)",
                }}
              >
                <span className="text-xs text-[#555] font-medium flex-shrink-0 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  Subcategory
                </span>
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
                  style={{
                    borderColor: activeSubcategory === null ? "#814ac8" : "#2a2a2a",
                    background:
                      activeSubcategory === null
                        ? "rgba(129,74,200,0.15)"
                        : "transparent",
                    color: activeSubcategory === null ? "#b07de8" : "#666",
                  }}
                >
                  All
                </button>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() =>
                      setActiveSubcategory(activeSubcategory === sub ? null : sub)
                    }
                    className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap"
                    style={{
                      borderColor: activeSubcategory === sub ? "#814ac8" : "#2a2a2a",
                      background:
                        activeSubcategory === sub
                          ? "rgba(129,74,200,0.15)"
                          : "transparent",
                      color: activeSubcategory === sub ? "#b07de8" : "#666",
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="border-b border-[#1a1a1a]" />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-end gap-3 flex-wrap bg-[#0d0d0d] border-b border-[#1a1a1a]">
        {/* Live Data badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs mr-auto"
          style={{
            borderColor: "#1a3a1a",
            background: "rgba(34,197,94,0.05)",
            color: "#4ade80",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: "#4ade80",
              animation: "orbPulse 2s ease-in-out infinite",
              boxShadow: "0 0 4px #4ade80",
            }}
          />
          Live Data · Updated just now
        </div>

        {/* Saved toggle */}
        <button
          onClick={() => setShowFavoritesOnly((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150"
          style={{
            borderColor: showFavoritesOnly ? "#814ac8" : "#2a2a2a",
            background: showFavoritesOnly ? "rgba(129,74,200,0.12)" : "transparent",
            color: showFavoritesOnly ? "#b07de8" : "#666",
          }}
        >
          <Bookmark className="w-3.5 h-3.5" fill={showFavoritesOnly ? "#b07de8" : "none"} />
          Saved
          {favorites.size > 0 && (
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                background: showFavoritesOnly ? "#814ac8" : "#2a2a2a",
                color: showFavoritesOnly ? "white" : "#888",
              }}
            >
              {favorites.size}
            </span>
          )}
        </button>

        {/* Search */}
        <div className="w-56">
          <SearchBar
            placeholder="Search tools..."
            onSearch={(q) => setSearch(q)}
            onChange={(q) => setSearch(q)}
            suggestions={tools.map((t) => t.name).slice(0, 20)}
          />
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200"
          style={{
            background:
              filtersOpen || filterCount > 0
                ? "rgba(129,74,200,0.12)"
                : "rgba(255,255,255,0.03)",
            borderColor: filtersOpen || filterCount > 0 ? "#814ac8" : "#2a2a2a",
            color: filtersOpen || filterCount > 0 ? "#b07de8" : "#777",
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {filterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ background: "#814ac8" }}
            >
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Content: Left Filter Panel + Table ────────────────────────── */}
      <div className="flex">
        {/* Left filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="flex-shrink-0 overflow-hidden"
              style={{ borderRight: "1px solid #1a1a1a", background: "#0a0a0a" }}
            >
              <div
                className="w-[260px] sticky top-[64px] overflow-y-auto px-5 py-5 space-y-7"
                style={{ maxHeight: "calc(100vh - 64px)" }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#666] uppercase tracking-wider">
                    Filters
                  </span>
                  <div className="flex items-center gap-2">
                    {filterCount > 0 && (
                      <button
                        onClick={() => setActiveFilters(DEFAULT_FILTERS)}
                        className="text-xs transition-colors"
                        style={{ color: "#814ac8" }}
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                      style={{ background: "#1e1e1e" }}
                    >
                      <X className="w-3.5 h-3.5 text-[#666]" />
                    </button>
                  </div>
                </div>

                {/* Pricing Model */}
                <FilterSection title="Pricing Model">
                  <div className="space-y-2">
                    {pricingOptions.map((opt) => (
                      <CheckboxRow
                        key={opt}
                        label={opt}
                        checked={activeFilters.pricingModels.includes(opt)}
                        onChange={(checked) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            pricingModels: checked
                              ? [...prev.pricingModels, opt]
                              : prev.pricingModels.filter((m) => m !== opt),
                          }))
                        }
                      />
                    ))}
                    {pricingOptions.length === 0 && (
                      <p className="text-xs text-[#444]">No pricing data</p>
                    )}
                  </div>
                </FilterSection>

                {/* Min Rating */}
                <FilterSection title="Minimum Rating">
                  <div className="flex gap-1.5 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            minRating: prev.minRating === star ? null : star,
                          }))
                        }
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150"
                        style={{
                          borderColor:
                            activeFilters.minRating === star ? "#814ac8" : "#2a2a2a",
                          background:
                            activeFilters.minRating === star
                              ? "rgba(129,74,200,0.15)"
                              : "transparent",
                          color:
                            activeFilters.minRating === star ? "#b07de8" : "#666",
                        }}
                      >
                        <Star
                          className="w-3 h-3"
                          fill={activeFilters.minRating === star ? "#b07de8" : "none"}
                        />
                        {star}+
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Min MAIM Score */}
                <FilterSection title="Min MAIM Score">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#555]">
                      <span>0</span>
                      <span style={{ color: "#814ac8" }} className="font-medium">
                        {activeFilters.minMaimScore ?? 0}+
                      </span>
                      <span>100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={activeFilters.minMaimScore ?? 0}
                      onChange={(e) =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          minMaimScore:
                            Number(e.target.value) === 0 ? null : Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#814ac8]"
                    />
                  </div>
                </FilterSection>

                {/* Featured Only */}
                <FilterSection title="Featured">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-[#888]">Featured only</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          featuredOnly: !prev.featuredOnly,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.featuredOnly ? "#814ac8" : "#2a2a2a",
                        width: "36px",
                        height: "20px",
                      }}
                    >
                      <div
                        className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{
                          transform: activeFilters.featuredOnly
                            ? "translateX(16px)"
                            : "translateX(0)",
                        }}
                      />
                    </div>
                  </label>
                </FilterSection>

                {/* Support Languages */}
                <FilterSection title="Support Language">
                  <div className="space-y-2">
                    {["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Other"].map((lang) => (
                      <CheckboxRow
                        key={lang}
                        label={lang}
                        checked={activeFilters.supportLanguages.includes(lang)}
                        onChange={(checked) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            supportLanguages: checked
                              ? [...prev.supportLanguages, lang]
                              : prev.supportLanguages.filter((l) => l !== lang),
                          }))
                        }
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Best For */}
                <FilterSection title="Best For">
                  <div className="flex flex-wrap gap-1.5">
                    {["Solo", "Small Team", "Mid-Market", "Enterprise", "All"].map((val) => (
                      <button
                        key={val}
                        onClick={() =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            bestFor: prev.bestFor.includes(val)
                              ? prev.bestFor.filter((v) => v !== val)
                              : [...prev.bestFor, val],
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-150"
                        style={{
                          borderColor: activeFilters.bestFor.includes(val) ? "#814ac8" : "#2a2a2a",
                          background: activeFilters.bestFor.includes(val) ? "rgba(129,74,200,0.15)" : "transparent",
                          color: activeFilters.bestFor.includes(val) ? "#b07de8" : "#666",
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Company HQ */}
                <FilterSection title="Company HQ">
                  <div className="space-y-2">
                    {["USA", "EU", "UK", "Canada", "LATAM", "Asia", "Other"].map((hq) => (
                      <CheckboxRow
                        key={hq}
                        label={hq}
                        checked={activeFilters.companyHq.includes(hq)}
                        onChange={(checked) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            companyHq: checked
                              ? [...prev.companyHq, hq]
                              : prev.companyHq.filter((h) => h !== hq),
                          }))
                        }
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Free Plan */}
                <FilterSection title="Free Plan">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-[#888]">Has free plan</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          hasFreePlan: prev.hasFreePlan === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.hasFreePlan === true ? "#814ac8" : "#2a2a2a",
                        width: "36px",
                        height: "20px",
                      }}
                    >
                      <div
                        className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{
                          transform: activeFilters.hasFreePlan === true ? "translateX(16px)" : "translateX(0)",
                        }}
                      />
                    </div>
                  </label>
                </FilterSection>

                {/* Has API */}
                <FilterSection title="API Access">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-[#888]">Has public API</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          hasApi: prev.hasApi === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.hasApi === true ? "#814ac8" : "#2a2a2a",
                        width: "36px",
                        height: "20px",
                      }}
                    >
                      <div
                        className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{
                          transform: activeFilters.hasApi === true ? "translateX(16px)" : "translateX(0)",
                        }}
                      />
                    </div>
                  </label>
                </FilterSection>

                {/* GDPR */}
                <FilterSection title="Compliance">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-[#888]">GDPR compliant</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          gdprCompliant: prev.gdprCompliant === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.gdprCompliant === true ? "#814ac8" : "#2a2a2a",
                        width: "36px",
                        height: "20px",
                      }}
                    >
                      <div
                        className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{
                          transform: activeFilters.gdprCompliant === true ? "translateX(16px)" : "translateX(0)",
                        }}
                      />
                    </div>
                  </label>
                </FilterSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="flex-1 min-w-0 pb-24">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
                  <SortHeader
                    label="Tool"
                    field="name"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    className="pl-5 w-[220px]"
                  />
                  <SortHeader
                    label="Category"
                    field="category"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Best For"
                    field="bestFor"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Pricing"
                    field="pricingModel"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Rating"
                    field="publicRating"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="MAIM Score"
                    field="maimScore"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <th className="px-3 py-3 text-xs font-semibold text-[#444] uppercase tracking-wider w-10" />
                  <th className="px-4 py-3 text-xs font-semibold text-[#444] uppercase tracking-wider text-right pr-5">
                    Visit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <p className="text-white font-medium mb-1">No tools found</p>
                      <p className="text-sm text-[#555]">
                        Try a different category or adjust filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((tool, idx) => (
                    <ToolRow
                      key={tool.id}
                      tool={tool}
                      categoryMap={categoryMap}
                      isEven={idx % 2 === 0}
                      isFavorite={favorites.has(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Icon name → emoji mapping ────────────────────────────────────────────────

const ICON_MAP: Record<string, string> = {
  TrendingUp: "📈",
  PenLine: "✍️",
  Palette: "🎨",
  Video: "🎥",
  Handshake: "🤝",
  Headphones: "🎧",
  CheckSquare: "✅",
  BarChart: "📊",
  BarChart2: "📊",
  Globe: "🌐",
  GraduationCap: "🎓",
  Code: "💻",
  Code2: "💻",
  Cpu: "🤖",
  Brain: "🧠",
  Zap: "⚡",
  Layers: "🗂️",
  Search: "🔍",
  Mail: "📧",
  MessageSquare: "💬",
  ShoppingCart: "🛒",
  FileText: "📄",
  Camera: "📷",
  Music: "🎵",
  Building: "🏢",
  Users: "👥",
  Settings: "⚙️",
  Star: "⭐",
  Shield: "🛡️",
  Database: "🗄️",
  Workflow: "🔄",
}

function getIcon(icon?: string): string {
  if (!icon) return "🤖"
  return ICON_MAP[icon] ?? icon
}

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({
  id,
  name,
  description,
  icon,
  count,
  active,
  onClick,
}: {
  id: string | null
  name: string
  description: string
  icon: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-xl border text-left transition-all duration-200"
      style={{
        minWidth: id === null ? "120px" : "170px",
        maxWidth: "200px",
        borderColor: active ? "#814ac8" : "#1e1e1e",
        background: active
          ? "rgba(129,74,200,0.10)"
          : "rgba(255,255,255,0.02)",
        boxShadow: active
          ? "0 0 0 1px rgba(129,74,200,0.3), 0 4px 20px rgba(129,74,200,0.10)"
          : "none",
      }}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-base leading-none">{getIcon(icon)}</span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            background: active ? "rgba(129,74,200,0.2)" : "#1e1e1e",
            color: active ? "#b07de8" : "#555",
          }}
        >
          {count}
        </span>
      </div>
      <span
        className="text-sm font-semibold leading-tight"
        style={{ color: active ? "#fff" : "#bbb" }}
      >
        {name}
      </span>
      <span
        className="text-[11px] leading-snug line-clamp-2"
        style={{ color: active ? "#888" : "#444" }}
      >
        {description}
      </span>
    </button>
  )
}

// ─── SortHeader ───────────────────────────────────────────────────────────────

function SortHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
  className = "",
}: {
  label: string
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (f: SortField) => void
  className?: string
}) {
  const isActive = sortField === field
  return (
    <th
      className={`px-4 py-3 text-left cursor-pointer select-none group ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-150"
          style={{ color: isActive ? "#814ac8" : "#444" }}
        >
          {label}
        </span>
        <span style={{ color: isActive ? "#814ac8" : "#333" }}>
          {isActive ? (
            sortDir === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  )
}

// ─── ToolRow ──────────────────────────────────────────────────────────────────

function ToolRow({
  tool,
  categoryMap,
  isEven,
  isFavorite,
  onToggleFavorite,
}: {
  tool: AirtableTool
  categoryMap: Record<string, string>
  isEven: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const initials = tool.name.slice(0, 2).toUpperCase()
  const categoryName = tool.category[0] ? categoryMap[tool.category[0]] : null
  const visitUrl = tool.affiliateLink ?? tool.websiteUrl

  return (
    <tr
      className="border-b transition-colors duration-100"
      style={{ borderColor: "#141414", background: isEven ? "#0d0d0d" : "#0f0f0f" }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background =
          "rgba(129,74,200,0.06)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = isEven
          ? "#0d0d0d"
          : "#0f0f0f"
      }}
    >
      {/* Tool */}
      <td className="pl-5 pr-4 py-3.5">
        <div className="flex items-center gap-3">
          {tool.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tool.logoUrl}
              alt={tool.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
              style={{ background: "#1a1a1a" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#1a1a1a", color: "#814ac8" }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate max-w-[150px]">
              {tool.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {tool.featured && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(129,74,200,0.15)", color: "#9d6ed4" }}>
                  ✦ Featured
                </span>
              )}
              {tool.hasFreePlan && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.10)", color: "#4ade80" }}>
                  Free
                </span>
              )}
              {tool.hasApi && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.10)", color: "#60a5fa" }}>
                  API
                </span>
              )}
              {tool.supportLanguages?.includes("Spanish") && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,146,60,0.10)", color: "#fb923c" }}>
                  ES
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3.5">
        {categoryName ? (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(129,74,200,0.10)", color: "#9d6ed4" }}
          >
            {categoryName}
          </span>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>

      {/* Best For */}
      <td className="px-4 py-3.5">
        {tool.bestFor ? (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background:
                tool.bestFor === "Solo" ? "rgba(34,197,94,0.08)" :
                tool.bestFor === "Small Team" ? "rgba(59,130,246,0.08)" :
                tool.bestFor === "Mid-Market" ? "rgba(251,146,60,0.08)" :
                tool.bestFor === "Enterprise" ? "rgba(129,74,200,0.08)" :
                "rgba(255,255,255,0.05)",
              color:
                tool.bestFor === "Solo" ? "#4ade80" :
                tool.bestFor === "Small Team" ? "#60a5fa" :
                tool.bestFor === "Mid-Market" ? "#fb923c" :
                tool.bestFor === "Enterprise" ? "#b07de8" :
                "#888",
            }}
          >
            {tool.bestFor}
          </span>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>

      {/* Pricing */}
      <td className="px-4 py-3.5">
        {tool.pricingModel ? (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border"
            style={{ borderColor: "#222", background: "#141414", color: "#777" }}
          >
            {tool.pricingModel}
          </span>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>

      {/* Rating */}
      <td className="px-4 py-3.5">
        {tool.publicRating != null ? (
          <div className="flex items-center gap-1.5">
            <Star
              className="w-3.5 h-3.5"
              style={{ color: "#814ac8", fill: "#814ac8" }}
            />
            <span className="text-sm font-medium text-white">
              {tool.publicRating.toFixed(1)}
            </span>
            <span className="text-xs text-[#444]">/ 5</span>
          </div>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>

      {/* MAIM Score */}
      <td className="px-4 py-3.5">
        {tool.maimScore != null ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-16 h-1.5 rounded-full overflow-hidden"
              style={{ background: "#1a1a1a" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(tool.maimScore, 100)}%`,
                  background: "linear-gradient(90deg, #814ac8, #b07de8)",
                }}
              />
            </div>
            <span className="text-sm font-medium text-white tabular-nums w-7">
              {tool.maimScore}
            </span>
          </div>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>

      {/* Bookmark */}
      <td className="px-3 py-3.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{
            background: isFavorite ? "rgba(129,74,200,0.12)" : "transparent",
          }}
          title={isFavorite ? "Remove from saved" : "Save tool"}
        >
          <Bookmark
            className="w-3.5 h-3.5 transition-all duration-150"
            style={{
              color: isFavorite ? "#814ac8" : "#333",
              fill: isFavorite ? "#814ac8" : "none",
            }}
          />
        </button>
      </td>

      {/* Visit */}
      <td className="px-4 py-3.5 pr-5 text-right">
        {visitUrl ? (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              background: "rgba(129,74,200,0.08)",
              color: "#9d6ed4",
              border: "1px solid rgba(129,74,200,0.18)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(129,74,200,0.20)"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "#814ac8"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#c497f0"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(129,74,200,0.08)"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(129,74,200,0.18)"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#9d6ed4"
            }}
          >
            Visit
            <ArrowUpRight className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#333] text-xs">—</span>
        )}
      </td>
    </tr>
  )
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── CheckboxRow ──────────────────────────────────────────────────────────────

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          borderColor: checked ? "#814ac8" : "#333",
          background: checked ? "#814ac8" : "transparent",
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className="text-xs transition-colors duration-150"
        style={{ color: checked ? "#ccc" : "#666" }}
      >
        {label}
      </span>
    </label>
  )
}
