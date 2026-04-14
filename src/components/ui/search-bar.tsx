"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, CircleDot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const DEFAULT_SUGGESTIONS = [
  "Content writing",
  "Marketing & SEO",
  "Design & Creative",
  "Video generation",
  "Sales & CRM",
  "Productivity tools",
  "Data & Analytics",
  "Customer support",
  "Image generation",
  "Code assistants",
  "Voice & Audio",
  "Website builders",
]

export const KEYWORD_CATEGORY_MAP: Record<string, string> = {
  designer: "Design",
  graphic: "Design",
  marketer: "Marketing",
  marketing: "Marketing",
  developer: "Developer Tools",
  coder: "Developer Tools",
  programmer: "Developer Tools",
  writer: "Content Creation",
  content: "Content Creation",
  copywriter: "Content Creation",
  sales: "Sales",
  support: "Customer Support",
  customer: "Customer Support",
  data: "Data & Analytics",
  analytics: "Data & Analytics",
  video: "Video",
  image: "Image Generation",
  audio: "Audio",
  productivity: "Productivity",
  hr: "HR",
  finance: "Finance",
  education: "Education",
  research: "Research",
  social: "Social Media",
}

const GooeyFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="gooey-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

// Stable random data — generated once per component mount, never on re-render
interface ParticleData {
  x: number
  y: number
  scale: number
  duration: number
  left: number
  top: number
  isPrimary: boolean
}

function generateParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
    scale: Math.random() * 0.8 + 0.4,
    duration: Math.random() * 1.5 + 1.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    isPrimary: i % 2 === 0,
  }))
}

interface ClickParticleData {
  offsetX: number
  offsetY: number
  scale: number
  duration: number
  isPrimary: boolean
}

function generateClickParticles(count: number): ClickParticleData[] {
  return Array.from({ length: count }, (_, i) => ({
    offsetX: (Math.random() - 0.5) * 160,
    offsetY: (Math.random() - 0.5) * 160,
    scale: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 0.8 + 0.5,
    isPrimary: i % 2 === 0,
  }))
}

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onChange?: (query: string) => void
  suggestions?: string[]
  className?: string
}

const SearchBar = ({
  placeholder = "I'm a designer / marketer / developer...",
  onSearch,
  onChange,
  suggestions: propSuggestions,
  className,
}: SearchBarProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Stable random data — generated once, never regenerated on re-render
  const particleData = useRef<ParticleData[]>(generateParticles(18))
  const clickParticleData = useRef<ClickParticleData[]>(generateClickParticles(14))

  const allSuggestions = propSuggestions ?? DEFAULT_SUGGESTIONS

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onChange?.(value)

    if (value.trim()) {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)

      if (onSearch || onChange) {
        onSearch?.(searchQuery)
        return
      }

      // Try to map query to a category using semantic matching
      const lowerQuery = searchQuery.toLowerCase()
      let matchedCategory: string | null = null

      // Check if any keyword appears in the query
      for (const [keyword, category] of Object.entries(KEYWORD_CATEGORY_MAP)) {
        if (lowerQuery.includes(keyword)) {
          matchedCategory = category
          break
        }
      }

      if (matchedCategory) {
        router.push(`/?category=${encodeURIComponent(matchedCategory)}#directory`)
      } else {
        router.push(`/?q=${encodeURIComponent(searchQuery)}#directory`)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFocused) {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    // Regenerate click particle offsets on each click for variety
    clickParticleData.current = generateClickParticles(14)
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 800)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchIconVariants: any = {
    initial: { scale: 1 },
    animate: {
      rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
      scale: isAnimating ? [1, 1.3, 1] : 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const suggestionVariants: any = {
    hidden: (i: number) => ({
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, delay: i * 0.05 },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 15, delay: i * 0.07 },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -5,
      scale: 0.9,
      transition: { duration: 0.1, delay: i * 0.03 },
    }),
  }

  return (
    <div className={cn("relative w-full", className)}>
      <GooeyFilter />
      <motion.form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-center w-full mx-auto"
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className={cn(
            "flex items-center w-full rounded-full border relative overflow-hidden backdrop-blur-md",
            isFocused
              ? "border-[#814ac8]/60"
              : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]"
          )}
          animate={{
            boxShadow: isClicked
              ? "0 0 40px rgba(129,74,200,0.5), 0 0 15px rgba(223,122,254,0.4) inset"
              : isFocused
              ? "0 0 32px rgba(129,74,200,0.3), 0 15px 35px rgba(0,0,0,0.4)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          onClick={handleClick}
        >
          {/* Animated gradient background on focus */}
          {isFocused && (
            <motion.div
              className="absolute inset-0"
              style={{ zIndex: -1 }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.08,
                background: [
                  "linear-gradient(90deg, #814ac8 0%, #df7afe 100%)",
                  "linear-gradient(90deg, #3c3489 0%, #a066d4 100%)",
                  "linear-gradient(90deg, #814ac8 0%, #df7afe 100%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Particle container — stable positions from ref */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              filter: isUnsupportedBrowser ? "none" : "url(#gooey-effect)",
              zIndex: 0,
            }}
          >
            {isFocused && particleData.current.map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  x: [0, p.x],
                  y: [0, p.y],
                  scale: [0, p.scale],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: p.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  filter: "blur(2px)",
                  background: p.isPrimary
                    ? "rgba(129,74,200,0.7)"
                    : "rgba(223,122,254,0.6)",
                }}
              />
            ))}
          </div>

          {/* Click ripple */}
          {isClicked && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(129,74,200,0.15)" }}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(129,74,200,0.1)" }}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </>
          )}

          {/* Click burst particles — stable offsets from ref */}
          {isClicked && clickParticleData.current.map((p, i) => (
            <motion.div
              key={`click-${i}`}
              initial={{ x: mousePosition.x, y: mousePosition.y, scale: 0, opacity: 1 }}
              animate={{
                x: mousePosition.x + p.offsetX,
                y: mousePosition.y + p.offsetY,
                scale: p.scale,
                opacity: [1, 0],
              }}
              transition={{ duration: p.duration, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: p.isPrimary ? "rgba(129,74,200,0.9)" : "rgba(223,122,254,0.9)",
                boxShadow: "0 0 8px rgba(129,74,200,0.8)",
              }}
            />
          ))}

          {/* Search icon */}
          <motion.div
            className="pl-5 py-4"
            variants={searchIconVariants}
            initial="initial"
            animate="animate"
          >
            <Search
              size={20}
              strokeWidth={isFocused ? 2.5 : 2}
              style={{
                color: isAnimating
                  ? "#df7afe"
                  : isFocused
                  ? "#814ac8"
                  : "rgba(255,255,255,0.4)",
                transition: "color 0.3s",
              }}
            />
          </motion.div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "w-full py-4 bg-transparent outline-none text-base relative font-medium",
              "placeholder:text-[rgba(255,255,255,0.3)]"
            )}
            style={{
              color: isFocused ? "#ffffff" : "rgba(255,255,255,0.7)",
              letterSpacing: isFocused ? "0.01em" : "normal",
              zIndex: 10,
              transition: "color 0.3s, letter-spacing 0.3s",
            }}
          />

          {/* Search button — appears when typing */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(129,74,200,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 mr-2 text-sm font-semibold rounded-full text-white backdrop-blur-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #814ac8 0%, #a066d4 100%)",
                  boxShadow: "0 4px 14px rgba(129,74,200,0.35)",
                  zIndex: 10,
                }}
              >
                Search
              </motion.button>
            )}
          </AnimatePresence>

          {/* Top shimmer on focus */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.06, 0.12, 0.06, 0],
                background:
                  "radial-gradient(circle at 50% 0%, rgba(223,122,254,0.6) 0%, transparent 70%)",
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            />
          )}
        </motion.div>
      </motion.form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 overflow-hidden rounded-2xl border"
            style={{
              background: "rgba(13,13,13,0.95)",
              backdropFilter: "blur(16px)",
              borderColor: "rgba(129,74,200,0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 24px rgba(129,74,200,0.15)",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  custom={index}
                  variants={suggestionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    setSearchQuery(suggestion)
                    if (onSearch) onSearch(suggestion)
                    setIsFocused(false)
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl"
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(129,74,200,0.12)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <CircleDot size={15} style={{ color: "#814ac8" }} />
                  </motion.div>
                  <motion.span
                    className="text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    {suggestion}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SearchBar }
