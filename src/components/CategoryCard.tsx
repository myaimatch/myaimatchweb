"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PlaceholderLogo {
  initials: string
  bg: string
  color: string
}

interface CategoryCardProps {
  name: string
  slug: string
  description: string
  icon: React.ReactNode
  placeholderLogos: PlaceholderLogo[]
}

export default function CategoryCard({
  name,
  slug,
  description,
  icon,
  placeholderLogos,
}: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setRotation({
      x: -((y - centerY) / centerY) * 7,
      y: ((x - centerX) / centerX) * 7,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const visibleLogos = placeholderLogos.slice(0, 5)
  const overflow = placeholderLogos.length - 5

  return (
    <motion.div
      ref={cardRef}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative rounded-2xl p-6 border overflow-hidden flex flex-col gap-5"
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: "#1a1a1a",
          borderColor: isHovered ? "#814ac8" : "#2a2a2a",
        }}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          y: isHovered ? -8 : 0,
          boxShadow: isHovered
            ? "0 24px 60px rgba(129,74,200,0.18)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Purple glow behind card */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 110%, rgba(129,74,200,0.45), transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glass sheen */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
          }}
          animate={{ opacity: isHovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />

        {/* Header — icon + name + description */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(129,74,200,0.18)" }}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <div>
            <p className="text-white text-sm font-semibold leading-snug">
              {name}
            </p>
            <p className="text-[#A0A0A0] text-xs mt-0.5">{description}</p>
          </div>
        </div>

        {/* Tool logo strip */}
        <div className="relative z-10 flex items-center gap-2">
          {visibleLogos.map((logo, i) => (
            <motion.div
              key={i}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: logo.bg, color: logo.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.12, y: -2 }}
            >
              {logo.initials}
            </motion.div>
          ))}
          {overflow > 0 && (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-medium flex-shrink-0"
              style={{ backgroundColor: "#2a2a2a", color: "#A0A0A0" }}
            >
              +{overflow}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="relative z-10 mt-auto">
          <Link href={`/directory?category=${slug}`}>
            <motion.span
              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: "#814ac8", color: "#ffffff" }}
              whileHover={{ backgroundColor: "#9b5fd4" } as never}
              whileTap={{ scale: 0.97 }}
            >
              View Tools
              <ArrowRight size={15} />
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
