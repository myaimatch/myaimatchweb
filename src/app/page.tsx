import Link from "next/link";
import type { Metadata } from "next";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import BannerCTA from "@/components/BannerCTA";
import DirectoryClient from "@/components/DirectoryClient";
import { fetchAllCategories, fetchAllTools } from "@/lib/airtable";

// SEARCH_BAR_HIDDEN_START — uncomment to restore semantic search bar routing to directory
// const SearchBarWrapper = dynamic(
//   () => import("@/components/ui/search-bar-wrapper").then((m) => ({ default: m.SearchBarWrapper })),
//   { ssr: false }
// );
// SEARCH_BAR_HIDDEN_END
// Keep Airtable-backed homepage directory fresh and avoid baking live data into static output.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "myAIMatch — Find AI Tools You'll Actually Use",
  description:
    "myAIMatch helps you match with the right AI tools for your workflow, team, budget, and ROI goals before wasting time on trials.",
  openGraph: {
    title: "myAIMatch — Find AI Tools You'll Actually Use",
    description:
      "myAIMatch helps you match with the right AI tools for your workflow, team, budget, and ROI goals before wasting time on trials.",
    url: "https://myaimatch.ai",
    type: "website",
  },
};

export default async function HomePage() {
  const [tools, categories] = await Promise.all([fetchAllTools(), fetchAllCategories()]);

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name;
  }

  return (
    <div className="bg-black text-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        {/* ── Background: base black ── */}
        <div style={{ position: "absolute", inset: 0, background: "#000005" }} />

        {/* ── Noise grain filter ── */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="overlay" />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            position: "absolute", inset: 0,
            filter: "url(#grain)",
            opacity: 0.04,
            background: "#ffffff",
            pointerEvents: "none",
          }}
        />

        {/* ── Spiral Animation (GSAP canvas) ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <SpiralAnimation />
        </div>

        {/* ── Orb — primary glow ── */}
        <div
          style={{
            position: "absolute",
            top: "-8%", left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(400px, 60vw, 800px)",
            height: "clamp(300px, 45vw, 600px)",
            background:
              "radial-gradient(ellipse 70% 65% at 50% 30%, rgba(129,74,200,0.55) 0%, rgba(223,122,254,0.12) 45%, transparent 70%)",
            animation: "orbPulse 7s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        {/* ── Orb — outer soft halo ── */}
        <div
          style={{
            position: "absolute",
            top: "-15%", left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(500px, 80vw, 1000px)",
            height: "clamp(400px, 60vw, 760px)",
            background:
              "radial-gradient(ellipse 80% 70% at 50% 28%, rgba(129,74,200,0.18) 0%, transparent 65%)",
            animation: "orbPulse2 9s 1s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* ── Bottom fade to black ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "220px",
            background: "linear-gradient(to bottom, transparent, #000000)",
            pointerEvents: "none",
          }}
        />

        {/* ── Hero content ── */}
        <div
          className="relative max-w-4xl mx-auto text-center px-4"
          style={{ paddingTop: "clamp(40px, 6vh, 80px)", paddingBottom: "clamp(80px, 12vh, 120px)" }}
        >
          {/* Badge */}
          <div
            style={{
              animation: "heroFadeUp 0.7s ease both",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.04)",
              marginBottom: "28px",
            }}
          >
            <span style={{ color: "#814ac8", fontSize: "12px" }}>✦</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.03em" }}>
              AI tool matching, not another directory
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold tracking-tight"
            style={{
              animation: "heroFadeUp 0.7s 0.15s ease both",
              fontSize: "clamp(38px, 7vw, 72px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
              color: "#ffffff",
            }}
          >
            Find the AI tools{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a066d4 0%, #df7afe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              you&apos;ll actually use.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              animation: "heroFadeUp 0.7s 0.3s ease both",
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 40px",
            }}
          >
            Our goal is to match you with the best tools for you, so you get
            real value from AI before wasting time on trials, teams, or promises
            that will not pay off.
          </p>

          {/* CTA Row */}
          <div
            style={{
              animation: "heroFadeUp 0.7s 0.45s ease both",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {/* Primary CTA */}
            <Link href="/assessment" className="hero-cta-primary">
              Get Your Free AI Assessment
            </Link>

            {/* Ghost CTA */}
            <Link href="/#directory" className="hero-cta-ghost">
              Browse the AI Directory
            </Link>
          </div>
        </div>
      </section>

      {/* ── Search Bar ───────────────────────────────────────────── */}
      {/* SEARCH_BAR_HIDDEN_START */}
      {/* <section className="px-4 pb-20 -mt-4">
        <div className="max-w-2xl mx-auto">
          <SearchBarWrapper />
        </div>
      </section> */}
      {/* SEARCH_BAR_HIDDEN_END */}

      {/* ── Directory Table ───────────────────────────────────────── */}
      <section id="directory" className="relative overflow-hidden bg-[#0d0d0d]">
        <div className="px-4 py-12">
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              AI Tools <span className="text-[#814ac8]">Directory</span>
            </h2>
            <p className="text-center text-[#A0A0A0] text-sm mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore the catalog, then use MyAIMatch to choose tools that fit
              your workflow, team, budget, and ROI goals.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                "Do not start a trial and waste time.",
                "Do not promise ROI before the tool fits.",
                "Do not onboard a team on tools they will not use.",
              ].map((point) => (
                <div
                  key={point}
                  className="rounded-[18px] border px-5 py-4 text-center text-sm font-medium text-white/70"
                  style={{
                    borderColor: "rgba(129,74,200,0.24)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
          <DirectoryClient tools={tools} categories={categories} categoryMap={categoryMap} />
        </div>
      </section>

      {/*
        HOMEPAGE_CATEGORY_CARDS_HIDDEN_START
        The previous "Explore AI Tools by Category" CategoryCard grid lived here.
        It is intentionally hidden so the homepage can show the full Airtable-backed
        directory table instead. Restore the old section here if category cards are
        needed again later.
        HOMEPAGE_CATEGORY_CARDS_HIDDEN_END
      */}

      {/*
        FEATURED_DEALS_HIDDEN_START
        The previous homepage Featured Deals carousel was moved to /deals.
        FEATURED_DEALS_HIDDEN_END
      */}

      {/* ── Assessment Promo Banner ───────────────────────────────── */}
      <BannerCTA />
    </div>
  );
}
