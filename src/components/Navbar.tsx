"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Directory", href: "/directory" },
  { label: "Compare", href: "/compare" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 bg-[#131313]/90 backdrop-blur-md border-b border-[#343434]"
        style={{ zIndex: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-white font-bold text-xl tracking-tight hover:text-[#8468EB] transition-colors"
            >
              myAIMatch
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#A0A0A0] hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/assessment"
                className="bg-[#8468EB] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#7459d4] transition-colors"
              >
                Get Your Free AI Stack
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#A0A0A0] hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in drawer — rendered OUTSIDE <nav> so backdrop-filter doesn't affect it */}
      {mobileOpen && (
        <div
          className="fixed inset-0 md:hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <div
            className="absolute right-0 top-0 h-full w-72 flex flex-col p-6"
            style={{
              backgroundColor: "#131313",
              borderLeft: "1px solid #343434",
              zIndex: 10000,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-bold text-xl">myAIMatch</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#A0A0A0] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#A0A0A0] hover:text-white text-base font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/assessment"
                className="mt-4 bg-[#8468EB] text-white text-sm font-semibold px-5 py-3 rounded-full text-center hover:bg-[#7459d4] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Your Free AI Stack
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
