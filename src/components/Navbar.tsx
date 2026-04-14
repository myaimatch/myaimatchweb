"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Directory", href: "/directory" },
  { label: "Deals", href: "/deals" },
  { label: "Compare", href: "/compare" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: scrolled ? "rgba(0,0,0,0.92)" : "rgba(8,8,10,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Subtle purple glow line at very top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "320px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(129,74,200,0.6), rgba(223,122,254,0.4), rgba(129,74,200,0.6), transparent)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "64px",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "rgba(129,74,200,0.15)",
                  border: "1px solid rgba(129,74,200,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/logo.png"
                  alt="MyAIMatch"
                  width={22}
                  height={22}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "-0.02em",
                  fontFamily: "inherit",
                }}
              >
                myAIMatch
              </span>
            </Link>

            {/* Desktop nav links */}
            <div
              className="hidden md:flex"
              style={{ alignItems: "center", gap: "4px" }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "14px",
                    fontWeight: 450,
                    padding: "6px 14px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "color 0.2s ease, background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right side: Assessment CTA */}
            <div
              className="hidden md:flex"
              style={{ alignItems: "center", gap: "16px" }}
            >
              <Link
                href="/assessment"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #814ac8 0%, #a066d4 100%)",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  padding: "8px 20px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  boxShadow:
                    "0 0 0 1px rgba(129,74,200,0.4), 0 4px 16px rgba(129,74,200,0.25), 0 1px 4px rgba(0,0,0,0.4)",
                  transition: "opacity 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = "0.9";
                  el.style.boxShadow = "0 0 0 1px rgba(129,74,200,0.6), 0 6px 24px rgba(129,74,200,0.35), 0 1px 4px rgba(0,0,0,0.4)";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = "1";
                  el.style.boxShadow = "0 0 0 1px rgba(129,74,200,0.4), 0 4px 16px rgba(129,74,200,0.25), 0 1px 4px rgba(0,0,0,0.4)";
                  el.style.transform = "translateY(0)";
                }}
              >
                Get Your Free AI Stack
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "rgba(255,255,255,0.7)",
                padding: "8px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "rgba(255,255,255,0.1)";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "rgba(255,255,255,0.05)";
                el.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 md:hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "288px",
              backgroundColor: "#0d0d0d",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              zIndex: 10000,
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "rgba(129,74,200,0.15)",
                    border: "1px solid rgba(129,74,200,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image src="/logo.png" alt="MyAIMatch" width={22} height={22} style={{ objectFit: "contain" }} />
                </div>
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  myAIMatch
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.6)",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "15px",
                    fontWeight: 500,
                    padding: "12px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "color 0.2s ease, background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "#fff";
                    el.style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "rgba(255,255,255,0.6)";
                    el.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Drawer CTA */}
            <div style={{ marginTop: "auto" }}>
              <Link
                href="/assessment"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #814ac8 0%, #a066d4 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "12px 20px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(129,74,200,0.3)",
                }}
              >
                Get Your Free AI Stack
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
