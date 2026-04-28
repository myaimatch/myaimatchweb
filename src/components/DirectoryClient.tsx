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
  Info,
} from "lucide-react"
import type { AirtableTool, AirtableCategory } from "@/lib/airtable"

const SearchBar = dynamic(
  () => import("@/components/ui/search-bar").then((m) => ({ default: m.SearchBar })),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 w-full rounded-full border border-white/10 bg-white/5 animate-pulse" />
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

const INITIAL_VISIBLE_TOOLS = 10
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
  const [sortField, setSortField] = useState<SortField>("communityReputation")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
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
    <div ref={directoryTopRef} className="relative scroll-mt-24 overflow-hidden rounded-[22px]">
      {/* Read URL search params inside its own Suspense to avoid RSC encoding issues */}
      <Suspense fallback={null}>
        <SearchParamsReader onParams={handleUrlParams} />
      </Suspense>
      {/* ── Category Cards ─────────────────────────────────────────────── */}
      <div
        className="pt-5 pb-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), rgba(10,10,12,0.94)",
        }}
      >
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, rgba(10,10,12,0.96), transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, rgba(10,10,12,0.96), transparent)" }}
          />

          <div
            className="flex gap-3 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <CategoryCard
              id={null}
              name="All Matches"
              icon="✦"
              active={activeCategory === null}
              onClick={() => handleCategorySelect(null)}
            />
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                icon={cat.icon ?? "🤖"}
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
                  borderColor: "rgba(255,255,255,0.06)",
                  scrollbarWidth: "none",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), rgba(20,16,32,0.58)",
                }}
              >
                <span className="text-xs font-medium flex-shrink-0 flex items-center gap-1 text-white/40">
                  <ChevronRight className="w-3 h-3" />
                  Subcategory
                </span>
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
                  style={{
                    borderColor: activeSubcategory === null ? "rgba(132,104,235,0.85)" : "rgba(255,255,255,0.12)",
                    background:
                      activeSubcategory === null
                        ? "linear-gradient(180deg, rgba(132,104,235,0.22), rgba(132,104,235,0.12))"
                        : "rgba(255,255,255,0.02)",
                    color: activeSubcategory === null ? "#d4c8ff" : "rgba(255,255,255,0.5)",
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
                      borderColor: activeSubcategory === sub ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.12)",
                      background:
                        activeSubcategory === sub
                          ? "linear-gradient(180deg, rgba(132,104,235,0.22), rgba(132,104,235,0.12))"
                          : "rgba(255,255,255,0.02)",
                      color: activeSubcategory === sub ? "#d4c8ff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div
        className="border-b px-4 sm:px-6 py-4"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02)), rgba(11,11,13,0.96)",
        }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 justify-start">
            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="h-12 min-w-[128px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  filtersOpen || filterCount > 0
                    ? "linear-gradient(180deg, rgba(132,104,235,0.2), rgba(132,104,235,0.12))"
                    : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                borderColor: filtersOpen || filterCount > 0 ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.12)",
                color: filtersOpen || filterCount > 0 ? "#d8cbff" : "rgba(255,255,255,0.62)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {filterCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: "#8468EB" }}
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
                    ? "linear-gradient(180deg, rgba(132,104,235,0.2), rgba(132,104,235,0.12))"
                    : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  borderColor: columnPickerOpen || activeColumnCount > 0 ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.12)",
                  color: columnPickerOpen || activeColumnCount > 0 ? "#d8cbff" : "rgba(255,255,255,0.62)",
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
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025)), rgba(11,11,13,0.97)",
                      borderColor: "rgba(255,255,255,0.1)",
                      minWidth: "220px",
                      boxShadow: "0 18px 44px rgba(0,0,0,0.5), 0 0 28px rgba(132,104,235,0.12)",
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-[10px] font-semibold text-white/35 uppercase tracking-widest">
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
                            background: visibleColumns[key] ? "rgba(132,104,235,0.14)" : "transparent",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150"
                            style={{
                              borderColor: visibleColumns[key] ? "#8468EB" : "rgba(255,255,255,0.16)",
                              background: visibleColumns[key] ? "#8468EB" : "transparent",
                            }}
                          >
                            {visibleColumns[key] && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: visibleColumns[key] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.46)" }}
                          >
                            {COLUMN_LABELS[key]}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <button
                        onClick={() => {
                          setVisibleColumns(DEFAULT_COLUMNS)
                          try { localStorage.setItem(LS_COLUMNS_KEY, JSON.stringify(DEFAULT_COLUMNS)) } catch { /* ignore */ }
                        }}
                        className="text-xs transition-colors"
                        style={{ color: "#8468EB" }}
                      >
                        Reset to default
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort A–Z button */}
            <button
              type="button"
              onClick={() => { setSortField("name"); setSortDir("asc"); }}
              className="h-12 min-w-[100px] hidden md:flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-150"
              style={{
                borderColor: sortField === "name" ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.12)",
                background: sortField === "name"
                  ? "linear-gradient(180deg, rgba(132,104,235,0.2), rgba(132,104,235,0.12))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                color: sortField === "name" ? "#d8cbff" : "rgba(255,255,255,0.62)",
              }}
            >
              Sort A–Z
            </button>

            {/* Saved toggle */}
            <button
              onClick={() => setShowFavoritesOnly((v) => !v)}
              className="h-12 min-w-[128px] flex items-center justify-center gap-2 px-4 rounded-full border text-sm font-semibold transition-all duration-150"
              style={{
                borderColor: showFavoritesOnly ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.12)",
                background: showFavoritesOnly
                  ? "linear-gradient(180deg, rgba(132,104,235,0.2), rgba(132,104,235,0.12))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                color: showFavoritesOnly ? "#d8cbff" : "rgba(255,255,255,0.62)",
              }}
            >
              <Bookmark className="w-4 h-4" fill={showFavoritesOnly ? "#b07de8" : "none"} />
              Saved
              {favorites.size > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    background: showFavoritesOnly ? "#8468EB" : "rgba(255,255,255,0.09)",
                    color: showFavoritesOnly ? "white" : "rgba(255,255,255,0.62)",
                  }}
                >
                  {favorites.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="w-full lg:ml-auto lg:w-[420px] lg:flex-none">
            <SearchBar
              placeholder="Search tools..."
              onSearch={(q) => setSearch(q)}
              onChange={(q) => setSearch(q)}
              suggestions={tools.map((t) => t.name).slice(0, 20)}
            />
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
              style={{
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), rgba(9,9,11,0.96)",
              }}
            >
              <div
                className="w-[260px] sticky top-[64px] overflow-y-auto px-5 py-5 space-y-7"
                style={{ maxHeight: "calc(100vh - 64px)" }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Filters
                  </span>
                  <div className="flex items-center gap-2">
                    {filterCount > 0 && (
                      <button
                        onClick={() => setActiveFilters(DEFAULT_FILTERS)}
                        className="text-xs transition-colors"
                        style={{ color: "#8468EB" }}
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <X className="w-3.5 h-3.5 text-white/45" />
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
                          borderColor: activeFilters.bestFor.includes(val) ? "#8468EB" : "rgba(255,255,255,0.12)",
                          background: activeFilters.bestFor.includes(val) ? "rgba(132,104,235,0.15)" : "transparent",
                          color: activeFilters.bestFor.includes(val) ? "#d4c8ff" : "rgba(255,255,255,0.48)",
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
                            activeFilters.minRating === star ? "#8468EB" : "rgba(255,255,255,0.12)",
                          background:
                            activeFilters.minRating === star
                              ? "rgba(132,104,235,0.15)"
                              : "transparent",
                          color:
                            activeFilters.minRating === star ? "#d4c8ff" : "rgba(255,255,255,0.48)",
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
                    <span className="text-sm text-white/58">Has free plan</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          hasFreePlan: prev.hasFreePlan === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.hasFreePlan === true ? "#8468EB" : "rgba(255,255,255,0.14)",
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
                    <span className="text-sm text-white/58">Has public API</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          hasApi: prev.hasApi === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.hasApi === true ? "#8468EB" : "rgba(255,255,255,0.14)",
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
                    <span className="text-sm text-white/58">GDPR compliant</span>
                    <div
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          gdprCompliant: prev.gdprCompliant === true ? null : true,
                        }))
                      }
                      className="cursor-pointer relative flex-shrink-0 rounded-full transition-all duration-200"
                      style={{
                        background: activeFilters.gdprCompliant === true ? "#8468EB" : "rgba(255,255,255,0.14)",
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
                      <span style={{ color: "rgba(255,255,255,0.32)" }}>$0</span>
                      <span style={{ color: "#8468EB" }} className="font-medium">
                        ${activeFilters.maxPrice}{activeFilters.maxPrice === 500 ? "+" : ""}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.32)" }}>$500+</span>
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
                      className="w-full accent-[#8468EB]"
                    />
                    <p className="text-[10px] text-white/30">
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
                <tr
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(10,10,12,0.98)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
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
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>
                        Full Description
                      </span>
                    </th>
                  )}
                  {visibleColumns.pricingSummary && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>
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
                    <th
                      className="px-4 py-3 text-left cursor-pointer select-none group"
                      onClick={() => handleSort("communityReputation")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-150"
                          style={{ color: sortField === "communityReputation" ? "#a88cff" : "rgba(255,255,255,0.38)" }}
                        >
                          Reputation
                        </span>
                        <span style={{ color: sortField === "communityReputation" ? "#a88cff" : "rgba(255,255,255,0.18)" }}>
                          {sortField === "communityReputation" ? (
                            sortDir === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                          )}
                        </span>
                        <div
                          className="group/info relative flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="h-3.5 w-3.5 cursor-help text-white/38 hover:text-white/70 transition-colors" />
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0d0d10] px-3 py-2 text-xs text-white/70 opacity-0 shadow-xl transition-opacity group-hover/info:opacity-100">
                            Community Reputation is a score from 1–5 based on user reviews, ratings, and community feedback across the web.
                          </div>
                        </div>
                      </div>
                    </th>
                  )}
                  {visibleColumns.freePlan && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>
                        Free Plan
                      </span>
                    </th>
                  )}
                  {/* Extra optional columns */}
                  {visibleColumns.hasApi && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>API</span>
                    </th>
                  )}
                  {visibleColumns.foundedYear && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Founded</span>
                    </th>
                  )}
                  {visibleColumns.companyHq && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>HQ</span>
                    </th>
                  )}
                  {visibleColumns.employeeCount && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Team Size</span>
                    </th>
                  )}
                  {visibleColumns.gdprCompliant && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>GDPR</span>
                    </th>
                  )}
                  {visibleColumns.soc2Certified && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>SOC2</span>
                    </th>
                  )}
                  {visibleColumns.hasMobileApp && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Mobile</span>
                    </th>
                  )}
                  {visibleColumns.trialDays && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Trial</span>
                    </th>
                  )}
                  {visibleColumns.supportLanguages && (
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Languages</span>
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
                  <th className="px-3 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider w-10" />
                  <th className="px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider text-right pr-5">
                    Visit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={20} className="text-center py-20">
                      <p className="text-white font-medium mb-1">No tools found</p>
                      <p className="text-sm text-white/36">
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
            <p className="text-sm text-white/50">
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
                  borderColor: "rgba(132,104,235,0.38)",
                  background: "linear-gradient(180deg, rgba(132,104,235,0.18), rgba(132,104,235,0.12))",
                  color: "#d4c8ff",
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
              borderColor: "rgba(132,104,235,0.42)",
              background: "rgba(13,13,13,0.92)",
              color: "#ffffff",
              boxShadow: "0 0 24px rgba(132,104,235,0.22)",
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="px-5 pb-8">
      <div
        className="overflow-hidden rounded-[18px] border"
        style={{
          borderColor: "rgba(132,104,235,0.26)",
          background:
            "radial-gradient(ellipse 74% 84% at 86% 0%, rgba(132,104,235,0.24), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025)), rgba(11,11,13,0.96)",
        }}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-white/[0.04] md:px-6"
        >
          <span>
            <span className="mt-1 block text-sm font-semibold tracking-tight text-white md:text-base">
              Want to suggest an AI tool worth using?
            </span>
            <span className="mt-1 block text-xs text-white/55">
              Click here to suggest one.
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-[#b07de8] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.form
              onSubmit={onSubmit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="border-t"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="grid gap-3 px-5 py-5 md:grid-cols-2 md:px-6 md:py-6">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white/52">Tool name</span>
                  <input
                    name="toolName"
                    required
                    placeholder="Example: Granola"
                    className="h-12 rounded-full border px-4 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/28 focus:border-[#8468EB]"
                    style={{
                      borderColor: "rgba(255,255,255,0.12)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(5,5,7,0.72)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white/52">Website link</span>
                  <input
                    name="websiteLink"
                    type="url"
                    required
                    placeholder="https://..."
                    className="h-12 rounded-full border px-4 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/28 focus:border-[#8468EB]"
                    style={{
                      borderColor: "rgba(255,255,255,0.12)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(5,5,7,0.72)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-xs font-semibold text-white/52">Why is it worth adding?</span>
                  <textarea
                    name="reason"
                    rows={3}
                    placeholder="Who should use it, and what makes it useful?"
                    className="resize-none rounded-[18px] border px-4 py-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-white/28 focus:border-[#8468EB]"
                    style={{
                      borderColor: "rgba(255,255,255,0.12)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(5,5,7,0.72)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
                    }}
                  />
                </label>
                <div className="flex justify-end md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #8468EB 0%, #5B42C3 100%)",
                      boxShadow: "0 0 0 1px rgba(132,104,235,0.46), 0 12px 28px rgba(132,104,235,0.28), 0 0 28px rgba(132,104,235,0.12)",
                    }}
                  >
                    Send tool suggestion
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
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
  icon,
  active,
  onClick,
}: {
  id: string | null
  name: string
  icon: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200"
      style={{
        minWidth: id === null ? "136px" : "164px",
        borderColor: active ? "rgba(132,104,235,0.82)" : "rgba(255,255,255,0.08)",
        background: active
          ? "linear-gradient(180deg, rgba(132,104,235,0.18), rgba(132,104,235,0.08)), rgba(30,22,52,0.78)"
          : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015)), rgba(18,18,20,0.74)",
        boxShadow: active
          ? "0 0 0 1px rgba(132,104,235,0.24), 0 16px 34px rgba(0,0,0,0.24), 0 0 24px rgba(132,104,235,0.12)"
          : "0 10px 24px rgba(0,0,0,0.14)",
      }}
    >
      <span className="text-base leading-none">{getIcon(icon)}</span>
      <span
        className="text-sm font-semibold leading-tight"
        style={{ color: active ? "#fff" : "rgba(255,255,255,0.74)" }}
      >
        {name}
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
          style={{ color: isActive ? "#a88cff" : "rgba(255,255,255,0.38)" }}
        >
          {label}
        </span>
        <span style={{ color: isActive ? "#a88cff" : "rgba(255,255,255,0.18)" }}>
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
      <span className="text-xs leading-relaxed text-white/58">{display}</span>
      {isLong && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          className="flex-shrink-0 mt-0.5 transition-colors duration-150"
          style={{ color: "#8468EB" }}
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
  return <Minus className="w-4 h-4" style={{ color: "rgba(255,255,255,0.16)" }} />
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
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        background: isEven
          ? "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.018)), rgba(18,18,20,0.94)"
          : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(23,23,26,0.94)",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background =
          "linear-gradient(90deg, rgba(132,104,235,0.14), rgba(132,104,235,0.06) 52%, rgba(255,255,255,0.02))"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = isEven
          ? "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.018)), rgba(18,18,20,0.94)"
          : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(23,23,26,0.94)"
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
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", color: "#a88cff" }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            {visitUrl ? (
              <a
                href={visitUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                referrerPolicy="no-referrer"
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
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(132,104,235,0.15)", color: "rgba(132,104,235,0.7)" }}>
                  ✦ Featured
                </span>
              )}
              {tool.hasFreePlan && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#61e892" }}>
                  Free
                </span>
              )}
              {tool.hasApi && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.12)", color: "#86b7ff" }}>
                  API
                </span>
              )}
              {tool.supportLanguages?.includes("Spanish") && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,146,60,0.12)", color: "#ffb169" }}>
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
              style={{
                background: "linear-gradient(180deg, rgba(132,104,235,0.18), rgba(132,104,235,0.1))",
                color: "#c7b6ff",
                border: "1px solid rgba(132,104,235,0.18)",
              }}
            >
              {categoryName}
            </span>
          ) : (
            <span className="text-white/18 text-xs">—</span>
          )}
        </td>
      )}

      {/* Full Description */}
      {visibleColumns.fullDescription && (
        <td className="px-4 py-3.5 max-w-[260px]">
          {tool.fullDescription ? (
            <ExpandableText text={tool.fullDescription} maxLength={80} />
          ) : (
            <span className="text-white/18 text-xs">—</span>
          )}
        </td>
      )}

      {/* Pricing Summary */}
      {visibleColumns.pricingSummary && (
        <td className="px-4 py-3.5 max-w-[200px]">
          {tool.pricingSummary ? (
            <span className="text-xs leading-relaxed line-clamp-2 text-white/62">
              {tool.pricingSummary.length > 60
                ? tool.pricingSummary.slice(0, 60) + "…"
                : tool.pricingSummary}
            </span>
          ) : (
            <span className="text-white/18 text-xs">—</span>
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
                background: "linear-gradient(180deg, rgba(132,104,235,0.16), rgba(132,104,235,0.08))",
                color: "#d3c5ff",
                border: "1px solid rgba(132,104,235,0.18)",
              }}
            >
              {tool.bestFor}
            </span>
          ) : (
            <span className="text-white/18 text-xs">—</span>
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
                style={{ color: "#a88cff", fill: "#a88cff" }}
              />
              <span className="text-sm font-medium text-white">
                {tool.communityReputation.toFixed(1)}
              </span>
              <span className="text-xs text-white/26">/ 5</span>
            </div>
          ) : (
            <span className="text-white/18 text-xs">—</span>
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
          <span className="text-xs text-white/58">{tool.foundedYear ?? "—"}</span>
        </td>
      )}
      {visibleColumns.companyHq && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-white/58">{tool.companyHq ?? "—"}</span>
        </td>
      )}
      {visibleColumns.employeeCount && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-white/58">{tool.employeeCount ?? "—"}</span>
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
          <span className="text-xs text-white/58">
            {tool.trialDays ? `${tool.trialDays}d` : "—"}
          </span>
        </td>
      )}
      {visibleColumns.supportLanguages && (
        <td className="px-4 py-3.5 max-w-[140px]">
          {tool.supportLanguages?.length ? (
            <span className="text-xs text-white/58 line-clamp-2">
              {tool.supportLanguages.slice(0, 3).join(", ")}
              {tool.supportLanguages.length > 3 ? ` +${tool.supportLanguages.length - 3}` : ""}
            </span>
          ) : (
            <span className="text-white/18 text-xs">—</span>
          )}
        </td>
      )}
      {visibleColumns.minMonthlyPrice && (
        <td className="px-4 py-3.5">
          <span className="text-xs text-white/58">
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
            background: isFavorite ? "rgba(132,104,235,0.14)" : "rgba(255,255,255,0.015)",
          }}
          title={isFavorite ? "Remove from saved" : "Save tool"}
        >
          <Bookmark
            className="w-3.5 h-3.5 transition-all duration-150"
            style={{
              color: isFavorite ? "#a88cff" : "rgba(255,255,255,0.2)",
              fill: isFavorite ? "#8468EB" : "none",
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
              background: "linear-gradient(180deg, rgba(132,104,235,0.14), rgba(132,104,235,0.08))",
              color: "#cbbcff",
              border: "1px solid rgba(132,104,235,0.24)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "linear-gradient(180deg, rgba(132,104,235,0.24), rgba(132,104,235,0.14))"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(132,104,235,0.9)"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#efe9ff"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "linear-gradient(180deg, rgba(132,104,235,0.14), rgba(132,104,235,0.08))"
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(132,104,235,0.24)"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#cbbcff"
            }}
          >
            Visit
            <ArrowUpRight className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-white/18 text-xs">—</span>
        )}
      </td>
    </tr>
  )
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">
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
          borderColor: checked ? "#8468EB" : "rgba(255,255,255,0.16)",
          background: checked ? "#8468EB" : "transparent",
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
        style={{ color: checked ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)" }}
      >
        {label}
      </span>
    </label>
  )
}
