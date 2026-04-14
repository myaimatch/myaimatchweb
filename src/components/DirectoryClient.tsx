"use client"

import { useState, useMemo, useCallback, useEffect, useRef, Suspense, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
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
  Columns,
  Check,
  Minus,
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

type SortField = "name" | "category" | "communityReputation" | "minMonthlyPrice" | "bestFor" | null
type SortDir = "asc" | "desc"

interface ActiveFilters {
  minRating: number | null
  maxPrice: number
  supportLanguages: string[]
  hasFreePlan: boolean | null
  bestFor: string[]
  hasApi: boolean | null
  companyHq: string[]
  gdprCompliant: boolean | null
}

const DEFAULT_FILTERS: ActiveFilters = {
  minRating: null,
  maxPrice: 500,
  supportLanguages: [],
  hasFreePlan: null,
  bestFor: [],
  hasApi: null,
  companyHq: [],
  gdprCompliant: null,
}

const INITIAL_VISIBLE_TOOLS = 20
const VISIBLE_TOOLS_INCREMENT = 20
const SUGGEST_TOOL_EMAIL = "admin@myaimatch.ai"

function countActiveFilters(f: ActiveFilters) {
  let n = 0
  if (f.minRating) n++
  if (f.maxPrice < 500) n++
  if (f.supportLanguages.length) n++
  if (f.hasFreePlan !== null) n++
  if (f.bestFor.length) n++
  if (f.hasApi !== null) n++
  if (f.companyHq.length) n++
  if (f.gdprCompliant !== null) n++
  return n
}

// ─── Column Picker ────────────────────────────────────────────────────────────

const COLUMN_CONFIG = [
  { key: "category", label: "Category", defaultVisible: true },
  { key: "fullDescription", label: "Full Description", defaultVisible: true },
  { key: "pricingSummary", label: "Pricing Summary", defaultVisible: true },
  { key: "bestFor", label: "Best For", defaultVisible: true },
  { key: "communityReputation", label: "Community Reputation", defaultVisible: true },
  { key: "freePlan", label: "Free Plan", defaultVisible: true },
  { key: "hasApi", label: "Has API", defaultVisible: false },
  { key: "foundedYear", label: "Founded Year", defaultVisible: false },
  { key: "companyHq", label: "Company HQ", defaultVisible: false },
  { key: "employeeCount", label: "Employee Count", defaultVisible: false },
  { key: "gdprCompliant", label: "GDPR Compliant", defaultVisible: false },
  { key: "soc2Certified", label: "SOC2 Certified", defaultVisible: false },
  { key: "hasMobileApp", label: "Mobile App", defaultVisible: false },
  { key: "trialDays", label: "Trial Days", defaultVisible: false },
  { key: "supportLanguages", label: "Support Languages", defaultVisible: false },
  { key: "minMonthlyPrice", label: "Min Monthly Price", defaultVisible: false },
] as const

type ColumnKey = (typeof COLUMN_CONFIG)[number]["key"]

const COLUMN_ORDER = COLUMN_CONFIG.map((column) => column.key)

const DEFAULT_COLUMNS = Object.fromEntries(
  COLUMN_CONFIG.map((column) => [column.key, column.defaultVisible])
) as Record<ColumnKey, boolean>

const COLUMN_LABELS = Object.fromEntries(
  COLUMN_CONFIG.map((column) => [column.key, column.label])
) as Record<ColumnKey, string>

const LS_COLUMNS_KEY = "maim-visible-columns"

function loadColumns(): Record<ColumnKey, boolean> {
  if (typeof window === "undefined") return DEFAULT_COLUMNS
  try {
    const stored = localStorage.getItem(LS_COLUMNS_KEY)
    if (!stored) return DEFAULT_COLUMNS
    const parsed = JSON.parse(stored) as Partial<Record<ColumnKey, boolean>>
    return { ...DEFAULT_COLUMNS, ...parsed }
  } catch {
    return DEFAULT_COLUMNS
  }
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

// ─── SearchParamsReader — isolated so useSearchParams() stays inside Suspense ──

function SearchParamsReader({
  onParams,
}: {
  onParams: (category: string | null, q: string | null) => void
}) {
  const searchParams = useSearchParams()
  useEffect(() => {
    onParams(searchParams.get("category"), searchParams.get("q"))
  }, [searchParams, onParams])
  return null
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
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(DEFAULT_COLUMNS)
  const [columnPickerOpen, setColumnPickerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TOOLS)
  const [showGoUp, setShowGoUp] = useState(false)
  const columnPickerRef = useRef<HTMLDivElement>(null)
  const directoryTopRef = useRef<HTMLDivElement>(null)
  const { favorites, toggle: toggleFavorite } = useFavorites()

  // Load column visibility from localStorage on mount
  useEffect(() => {
    setVisibleColumns(loadColumns())
  }, [])

  // Close column picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (columnPickerRef.current && !columnPickerRef.current.contains(e.target as Node)) {
        setColumnPickerOpen(false)
      }
    }
    if (columnPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [columnPickerOpen])

  // Receive URL params from SearchParamsReader
  const handleUrlParams = useCallback(
    (categoryParam: string | null, queryParam: string | null) => {
      if (categoryParam) {
        const matchedCategory = categories.find((cat) => cat.name === categoryParam)
        if (matchedCategory) setActiveCategory(matchedCategory.id)
      }
      if (queryParam) setSearch(queryParam)
    },
    [categories]
  )

  const toggleColumn = useCallback((key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(LS_COLUMNS_KEY, JSON.stringify(next))
      } catch { /* ignore */ }
      return next
    })
  }, [])

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
      setActiveSubcategory(null)
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
    if (activeFilters.minRating != null) {
      result = result.filter((t) => (t.communityReputation ?? 0) >= activeFilters.minRating!)
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
    if (activeFilters.supportLanguages.length) {
      result = result.filter((t) =>
        t.supportLanguages?.some((lang) => activeFilters.supportLanguages.includes(lang))
      )
    }
    if (activeFilters.maxPrice < 500) {
      result = result.filter(
        (t) => !t.minMonthlyPrice || t.minMonthlyPrice <= activeFilters.maxPrice
      )
    }
    // 5. Favorites only
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
        } else if (sortField === "communityReputation") {
          aVal = a.communityReputation ?? 0
          bVal = b.communityReputation ?? 0
        } else if (sortField === "minMonthlyPrice") {
          aVal = a.minMonthlyPrice ?? 0
          bVal = b.minMonthlyPrice ?? 0
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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_TOOLS)
  }, [
    activeCategory,
    activeSubcategory,
    search,
    activeFilters,
    showFavoritesOnly,
    sortField,
    sortDir,
  ])

  useEffect(() => {
    const handleScroll = () => {
      const top = directoryTopRef.current?.getBoundingClientRect().top ?? 0
      const absoluteTop = top + window.scrollY
      setShowGoUp(window.scrollY > absoluteTop + 520 || visibleCount > INITIAL_VISIBLE_TOOLS)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [visibleCount])

  const visibleTools = useMemo(
    () => filteredTools.slice(0, visibleCount),
    [filteredTools, visibleCount]
  )

  const shownToolCount = Math.min(visibleCount, filteredTools.length)
  const canShowMore = shownToolCount < filteredTools.length

  const scrollToDirectoryTop = useCallback(() => {
    directoryTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleSuggestToolSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const toolName = String(formData.get("toolName") ?? "").trim()
    const websiteLink = String(formData.get("websiteLink") ?? "").trim()
    const reason = String(formData.get("reason") ?? "").trim()

    if (!toolName || !websiteLink) return

    const subject = `Tool suggestion: ${toolName}`
    const body = [
      `Tool name: ${toolName}`,
      `Website link: ${websiteLink}`,
      reason ? `Why it is worth adding: ${reason}` : "",
    ].filter(Boolean).join("\n")

    window.location.href = `mailto:${SUGGEST_TOOL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [])

  const filterCount = countActiveFilters(activeFilters)

  // Count visible optional columns
  const activeColumnCount = COLUMN_ORDER.filter(
    (k) => visibleColumns[k] && !DEFAULT_COLUMNS[k]
  ).length

  return (
    <div ref={directoryTopRef} className="relative scroll-mt-24">
      {/* Read URL search params inside its own Suspense to avoid RSC encoding issues */}
      <Suspense fallback={null}>
        <SearchParamsReader onParams={handleUrlParams} />
      </Suspense>
      {/* ── Category Cards ─────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] pt-5 pb-0">
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, #0d0d0d, transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, #0d0d0d, transparent)" }}
          />

          <div
            className="flex gap-3 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
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

        {/* Subcategory chips */}
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

        <div className="border-b border-[#1a1a1a]" />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] px-4 sm:px-6 py-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-wrap items-center gap-3 justify-start">
            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="h-12 min-w-[128px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-200"
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

            {/* Column Picker — hidden on mobile */}
            <div className="relative hidden md:block" ref={columnPickerRef}>
              <button
                onClick={() => setColumnPickerOpen((v) => !v)}
                className="h-12 min-w-[128px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-200"
                style={{
                  background: columnPickerOpen || activeColumnCount > 0
                    ? "rgba(129,74,200,0.12)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: columnPickerOpen || activeColumnCount > 0 ? "#814ac8" : "#2a2a2a",
                  color: columnPickerOpen || activeColumnCount > 0 ? "#b07de8" : "#777",
                }}
              >
                <Columns className="w-4 h-4" />
                Columns
              </button>

              <AnimatePresence>
                {columnPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 z-50 rounded-xl border overflow-hidden"
                    style={{
                      background: "#0f0f0f",
                      borderColor: "#2a2a2a",
                      minWidth: "220px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#1a1a1a" }}>
                      <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">
                        Visible Columns
                      </span>
                    </div>
                    <div className="px-3 py-2 space-y-0.5 max-h-[320px] overflow-y-auto">
                      {COLUMN_ORDER.map((key) => (
                        <button
                          key={key}
                          onClick={() => toggleColumn(key)}
                          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors duration-100"
                          style={{
                            background: visibleColumns[key] ? "rgba(129,74,200,0.08)" : "transparent",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150"
                            style={{
                              borderColor: visibleColumns[key] ? "#814ac8" : "#333",
                              background: visibleColumns[key] ? "#814ac8" : "transparent",
                            }}
                          >
                            {visibleColumns[key] && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: visibleColumns[key] ? "#ccc" : "#666" }}
                          >
                            {COLUMN_LABELS[key]}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t" style={{ borderColor: "#1a1a1a" }}>
                      <button
                        onClick={() => {
                          setVisibleColumns(DEFAULT_COLUMNS)
                          try { localStorage.setItem(LS_COLUMNS_KEY, JSON.stringify(DEFAULT_COLUMNS)) } catch { /* ignore */ }
                        }}
                        className="text-xs transition-colors"
                        style={{ color: "#814ac8" }}
                      >
                        Reset to default
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Saved toggle */}
            <button
              onClick={() => setShowFavoritesOnly((v) => !v)}
              className="h-12 min-w-[128px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-150"
              style={{
                borderColor: showFavoritesOnly ? "#814ac8" : "#2a2a2a",
                background: showFavoritesOnly ? "rgba(129,74,200,0.12)" : "rgba(255,255,255,0.03)",
                color: showFavoritesOnly ? "#b07de8" : "#777",
              }}
            >
              <Bookmark className="w-4 h-4" fill={showFavoritesOnly ? "#b07de8" : "none"} />
              Saved
              {favorites.size > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    background: showFavoritesOnly ? "#814ac8" : "#2a2a2a",
                    color: showFavoritesOnly ? "white" : "#888",
                  }}
                >
                  {favorites.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="w-full max-w-[420px] justify-self-center">
            <SearchBar
              placeholder="Search tools..."
              onSearch={(q) => setSearch(q)}
              onChange={(q) => setSearch(q)}
              suggestions={tools.map((t) => t.name).slice(0, 20)}
            />
          </div>

          <div className="flex justify-start lg:justify-end">
            {/* Live Data badge */}
            <div
              className="h-12 min-w-[190px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold"
              style={{
                borderColor: "rgba(129,74,200,0.26)",
                background: "rgba(129,74,200,0.06)",
                color: "#b07de8",
              }}
            >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: "#814ac8",
                animation: "orbPulse 2s ease-in-out infinite",
                boxShadow: "0 0 8px #814ac8",
              }}
            />
              Live Data · Updated just now
            </div>
          </div>
        </div>
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

                {/* Best For */}
                <FilterSection title="Best For">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Graphic Designers", "Email Marketers", "Software Developers",
                      "Content Creators", "Data Analysts", "Sales Representatives",
                      "Customer Support Agents", "Project Managers", "HR Professionals", "General Users"
                    ].map((val) => (
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

                {/* Min Community Reputation */}
                <FilterSection title="Minimum Reputation">
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

                {/* Max Monthly Price */}
                <FilterSection title="Max Monthly Price">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#555" }}>$0</span>
                      <span style={{ color: "#814ac8" }} className="font-medium">
                        ${activeFilters.maxPrice}{activeFilters.maxPrice === 500 ? "+" : ""}
                      </span>
                      <span style={{ color: "#555" }}>$500+</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={10}
                      value={activeFilters.maxPrice}
                      onChange={(e) =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          maxPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#814ac8]"
                    />
                    <p className="text-[10px] text-[#444]">
                      Shows tools with starting price ≤ ${activeFilters.maxPrice}{activeFilters.maxPrice === 500 ? " (all)" : ""}
                    </p>
                  </div>
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
                  {/* Tool — always visible */}
                  <SortHeader
                    label="Tool"
                    field="name"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    className="pl-5 w-[220px]"
                  />
                  {/* Toggleable columns */}
                  {visibleColumns.category && (
                    <SortHeader
                      label="Category"
                      field="category"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  )}
                  {visibleColumns.fullDescription && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>
                        Full Description
                      </span>
                    </th>
                  )}
                  {visibleColumns.pricingSummary && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>
                        Pricing Summary
                      </span>
                    </th>
                  )}
                  {visibleColumns.bestFor && (
                    <SortHeader
                      label="Best For"
                      field="bestFor"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  )}
                  {visibleColumns.communityReputation && (
                    <SortHeader
                      label="Reputation"
                      field="communityReputation"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  )}
                  {visibleColumns.freePlan && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>
                        Free Plan
                      </span>
                    </th>
                  )}
                  {/* Extra optional columns */}
                  {visibleColumns.hasApi && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>API</span>
                    </th>
                  )}
                  {visibleColumns.foundedYear && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>Founded</span>
                    </th>
                  )}
                  {visibleColumns.companyHq && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>HQ</span>
                    </th>
                  )}
                  {visibleColumns.employeeCount && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>Team Size</span>
                    </th>
                  )}
                  {visibleColumns.gdprCompliant && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>GDPR</span>
                    </th>
                  )}
                  {visibleColumns.soc2Certified && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>SOC2</span>
                    </th>
                  )}
                  {visibleColumns.hasMobileApp && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>Mobile</span>
                    </th>
                  )}
                  {visibleColumns.trialDays && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>Trial</span>
                    </th>
                  )}
                  {visibleColumns.supportLanguages && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#444" }}>Languages</span>
                    </th>
                  )}
                  {visibleColumns.minMonthlyPrice && (
                    <SortHeader
                      label="Min Price"
                      field="minMonthlyPrice"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  )}
                  {/* Always-visible: bookmark + visit */}
                  <th className="px-3 py-3 text-xs font-semibold text-[#444] uppercase tracking-wider w-10" />
                  <th className="px-4 py-3 text-xs font-semibold text-[#444] uppercase tracking-wider text-right pr-5">
                    Visit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={20} className="text-center py-20">
                      <p className="text-white font-medium mb-1">No tools found</p>
                      <p className="text-sm text-[#555]">
                        Try a different category or adjust filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleTools.map((tool, idx) => (
                    <ToolRow
                      key={tool.id}
                      tool={tool}
                      categoryMap={categoryMap}
                      isEven={idx % 2 === 0}
                      isFavorite={favorites.has(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                      visibleColumns={visibleColumns}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#777]">
              Showing <span className="font-semibold text-white">{shownToolCount}</span> of{" "}
              <span className="font-semibold text-white">{filteredTools.length}</span> tools
            </p>
            {canShowMore && (
              <button
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(count + VISIBLE_TOOLS_INCREMENT, filteredTools.length)
                  )
                }
                className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-all duration-200 sm:ml-auto"
                style={{
                  borderColor: "rgba(129,74,200,0.35)",
                  background: "rgba(129,74,200,0.12)",
                  color: "#b07de8",
                }}
              >
                Show more
              </button>
            )}
          </div>
          <SuggestToolForm onSubmit={handleSuggestToolSubmit} />
        </div>
      </div>

      <AnimatePresence>
        {showGoUp && (
          <motion.button
            type="button"
            onClick={scrollToDirectoryTop}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="fixed bottom-6 right-5 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold"
            style={{
              borderColor: "rgba(129,74,200,0.42)",
              background: "rgba(13,13,13,0.92)",
              color: "#ffffff",
              boxShadow: "0 0 24px rgba(129,74,200,0.22)",
              backdropFilter: "blur(14px)",
            }}
          >
            <ChevronUp className="h-4 w-4 text-[#b07de8]" />
            Go up
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuggestToolForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="px-5 pb-8">
      <form
        onSubmit={onSubmit}
        className="rounded-[18px] border p-5 md:p-6"
        style={{
          borderColor: "rgba(129,74,200,0.22)",
          background:
            "radial-gradient(ellipse 70% 80% at 85% 0%, rgba(129,74,200,0.16), transparent 60%), rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
          <div className="lg:max-w-sm lg:flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#814ac8]">
              Suggest a tool
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Know an AI tool worth adding?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Do you want us to add a new tool that is worthwhile? Send the name
              and link to the website here.
            </p>
          </div>

          <div className="grid flex-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-white/45">Tool name</span>
              <input
                name="toolName"
                required
                placeholder="Example: Granola"
                className="h-12 rounded-full border bg-black/30 px-4 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/25 focus:border-[#814ac8]"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-white/45">Website link</span>
              <input
                name="websiteLink"
                type="url"
                required
                placeholder="https://..."
                className="h-12 rounded-full border bg-black/30 px-4 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/25 focus:border-[#814ac8]"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-xs font-semibold text-white/45">Why is it worth adding?</span>
              <textarea
                name="reason"
                rows={3}
                placeholder="Who should use it, and what makes it useful?"
                className="resize-none rounded-[18px] border bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/25 focus:border-[#814ac8]"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              />
            </label>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #814ac8 0%, #a066d4 100%)",
                  boxShadow: "0 0 0 1px rgba(129,74,200,0.4), 0 8px 24px rgba(129,74,200,0.24)",
                }}
              >
                Send tool suggestion
              </button>
            </div>
          </div>
        </div>
      </form>
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

function ExpandableText({ text, maxLength }: { text: string; maxLength: number }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > maxLength
  const display = expanded || !isLong ? text : text.slice(0, maxLength) + "…"

  return (
    <div className="flex items-start gap-1">
      <span className="text-xs text-[#888] leading-relaxed">{display}</span>
      {isLong && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          className="flex-shrink-0 mt-0.5 transition-colors duration-150"
          style={{ color: "#814ac8" }}
          title={expanded ? "Show less" : "Show more"}
        >
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
          }
        </button>
      )}
    </div>
  )
}

function BoolCell({ value }: { value: boolean | undefined }) {
  if (value === true) {
    return <Check className="w-4 h-4" style={{ color: "#4ade80" }} />
  }
  return <Minus className="w-4 h-4" style={{ color: "#333" }} />
}

function ToolRow({
  tool,
  categoryMap,
  isEven,
  isFavorite,
  onToggleFavorite,
  visibleColumns,
}: {
  tool: AirtableTool
  categoryMap: Record<string, string>
  isEven: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  visibleColumns: Record<ColumnKey, boolean>
}) {
  const initials = tool.name.slice(0, 2).toUpperCase()
  const categoryName = tool.category[0] ? categoryMap[tool.category[0]] : null
  const visitUrl = tool.websiteUrl

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
      {/* Tool — always visible */}
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
            {visitUrl ? (
              <a
                href={visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-semibold text-white truncate max-w-[150px] transition-colors duration-150 hover:text-[#b07de8]"
              >
                {tool.name}
              </a>
            ) : (
              <p className="text-sm font-semibold text-white truncate max-w-[150px]">
                {tool.name}
              </p>
            )}
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
      {visibleColumns.category && (
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
      )}

      {/* Full Description */}
      {visibleColumns.fullDescription && (
        <td className="px-4 py-3.5 max-w-[260px]">
          {tool.fullDescription ? (
            <ExpandableText text={tool.fullDescription} maxLength={80} />
          ) : (
            <span className="text-[#333] text-xs">—</span>
          )}
        </td>
      )}

      {/* Pricing Summary */}
      {visibleColumns.pricingSummary && (
        <td className="px-4 py-3.5 max-w-[200px]">
          {tool.pricingSummary ? (
            <span className="text-xs text-[#888] leading-relaxed line-clamp-2">
              {tool.pricingSummary.length > 60
                ? tool.pricingSummary.slice(0, 60) + "…"
                : tool.pricingSummary}
            </span>
          ) : (
            <span className="text-[#333] text-xs">—</span>
          )}
        </td>
      )}

      {/* Best For */}
      {visibleColumns.bestFor && (
        <td className="px-4 py-3.5">
          {tool.bestFor ? (
            <span
              className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(129,74,200,0.08)",
                color: "#b07de8",
              }}
            >
              {tool.bestFor}
            </span>
          ) : (
            <span className="text-[#333] text-xs">—</span>
          )}
        </td>
      )}

      {/* Community Reputation */}
      {visibleColumns.communityReputation && (
        <td className="px-4 py-3.5">
          {tool.communityReputation != null ? (
            <div className="flex items-center gap-1.5">
              <Star
                className="w-3.5 h-3.5"
                style={{ color: "#814ac8", fill: "#814ac8" }}
              />
              <span className="text-sm font-medium text-white">
                {tool.communityReputation.toFixed(1)}
              </span>
              <span className="text-xs text-[#444]">/ 5</span>
            </div>
          ) : (
            <span className="text-[#333] text-xs">—</span>
          )}
        </td>
      )}

      {/* Free Plan */}
      {visibleColumns.freePlan && (
        <td className="px-4 py-3.5">
          <BoolCell value={tool.hasFreePlan} />
        </td>
      )}

      {/* Optional columns */}
      {visibleColumns.hasApi && (
        <td className="px-4 py-3.5"><BoolCell value={tool.hasApi} /></td>
      )}
      {visibleColumns.foundedYear && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-[#888]">{tool.foundedYear ?? "—"}</span>
        </td>
      )}
      {visibleColumns.companyHq && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-[#888]">{tool.companyHq ?? "—"}</span>
        </td>
      )}
      {visibleColumns.employeeCount && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-[#888]">{tool.employeeCount ?? "—"}</span>
        </td>
      )}
      {visibleColumns.gdprCompliant && (
        <td className="px-4 py-3.5"><BoolCell value={tool.gdprCompliant} /></td>
      )}
      {visibleColumns.soc2Certified && (
        <td className="px-4 py-3.5"><BoolCell value={tool.soc2Certified} /></td>
      )}
      {visibleColumns.hasMobileApp && (
        <td className="px-4 py-3.5"><BoolCell value={tool.hasMobileApp} /></td>
      )}
      {visibleColumns.trialDays && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-[#888]">
            {tool.trialDays ? `${tool.trialDays}d` : "—"}
          </span>
        </td>
      )}
      {visibleColumns.supportLanguages && (
        <td className="px-4 py-3.5 max-w-[140px]">
          {tool.supportLanguages?.length ? (
            <span className="text-xs text-[#888] line-clamp-2">
              {tool.supportLanguages.slice(0, 3).join(", ")}
              {tool.supportLanguages.length > 3 ? ` +${tool.supportLanguages.length - 3}` : ""}
            </span>
          ) : (
            <span className="text-[#333] text-xs">—</span>
          )}
        </td>
      )}
      {visibleColumns.minMonthlyPrice && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-[#888]">
            {tool.minMonthlyPrice != null ? `$${tool.minMonthlyPrice}` : "—"}
          </span>
        </td>
      )}

      {/* Bookmark — always visible */}
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

      {/* Visit — always visible, uses websiteUrl */}
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
