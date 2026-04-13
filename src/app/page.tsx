import Link from "next/link";
import type { Metadata } from "next";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { BeamsBackground } from "@/components/ui/beams-background";
import { OfferCarousel } from "@/components/ui/offer-carousel";
import type { Deal } from "@/components/ui/offer-carousel";
import BannerCTA from "@/components/BannerCTA";

// SEARCH_BAR_HIDDEN_START — uncomment to restore semantic search bar routing to directory
// const SearchBarWrapper = dynamic(
//   () => import("@/components/ui/search-bar-wrapper").then((m) => ({ default: m.SearchBarWrapper })),
//   { ssr: false }
// );
// SEARCH_BAR_HIDDEN_END
import {
  TrendingUp,
  PenLine,
  Palette,
  Video,
  Handshake,
  Headphones,
  CheckSquare,
  BarChart2,
  Globe,
  GraduationCap,
} from "lucide-react";
import CategoryCard from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "myAIMatch — Find the Right AI Tools for You",
  description:
    "Whether you're a founder, freelancer, or just AI-curious — myAIMatch matches you to the exact AI tools you need to work smarter. No jargon. Free assessment included.",
  openGraph: {
    title: "myAIMatch — Find the Right AI Tools for You",
    description:
      "Whether you're a founder, freelancer, or just AI-curious — myAIMatch matches you to the exact AI tools you need to work smarter. No jargon. Free assessment included.",
    url: "https://myaimatch.ai",
    type: "website",
  },
};

// ─── Placeholder logo sets (14 per category) ─────────────────────
// Real logos will come from Airtable. Monochrome until real assets are ready.
const greys = ["#1e1e1e", "#252525", "#2a2a2a", "#303030"];
const mkLogos = (initials: string[]) =>
  initials.map((i, idx) => ({
    initials: i,
    bg: greys[idx % greys.length],
    color: "rgba(255,255,255,0.65)",
  }));

const logoSets = {
  "marketing-seo": mkLogos(["Sm","AH","SE","Mk","Gs","Mb","Hs","Kw","Sp","Cl","Lm","Rb","Mr","Wr"]),
  "content-writing": mkLogos(["Js","Cp","Wr","Ry","Su","Cl","Gm","Cn","Bz","Nl","Hy","Wt","Pf","Kl"]),
  "design-creative": mkLogos(["Md","Cv","Ad","Fg","Sk","Dr","Rm","Ps","Il","Cr","Sp","Vk","Nv","Lx"]),
  "video-audio": mkLogos(["Sy","Dc","Rv","Lm","Ee","Mu","Ca","Ec","Vc","Ht","Wv","Ss","Pp","Fl"]),
  "sales-crm": mkLogos(["Sf","Hs","Pp","Cl","Ol","Zp","Ga","At","Nd","Lr","Kr","Mn","Ou","Rs"]),
  "customer-support": mkLogos(["It","Zd","Ic","Fr","Gp","Cr","Lc","Dr","Hl","Kn","Vo","Cy","Tn","Sp"]),
  "productivity-ops": mkLogos(["Nt","Sl","As","Mo","Cl","Ai","Zm","Zp","Lp","Tb","Cr","Od","Re","Sc"]),
  "data-analytics": mkLogos(["Ga","Tb","Lk","Mx","Dg","Bq","Pw","Ht","Sp","Am","Rf","Mt","Dc","Md"]),
  "website-landing-pages": mkLogos(["Wf","Fr","Wp","Sq","Sw","Ub","Sh","Lp","Cm","El","Bz","Cs","Hb","Vr"]),
  "learning-training": mkLogos(["Co","Ud","Ll","Sk","Kh","Mg","Th","Lv","Ep","Ac","Dc","Bk","Sp","Rc"]),
};

// ─── Category data ────────────────────────────────────────────────
const categories = [
  {
    name: "Marketing & SEO",
    slug: "marketing-seo",
    description: "Drive traffic and rank higher",
    icon: TrendingUp,
    placeholderLogos: logoSets["marketing-seo"],
  },
  {
    name: "Content & Writing",
    slug: "content-writing",
    description: "Create content at scale",
    icon: PenLine,
    placeholderLogos: logoSets["content-writing"],
  },
  {
    name: "Design & Creative",
    slug: "design-creative",
    description: "Produce stunning visuals fast",
    icon: Palette,
    placeholderLogos: logoSets["design-creative"],
  },
  {
    name: "Video & Audio",
    slug: "video-audio",
    description: "Edit, generate, and produce media",
    icon: Video,
    placeholderLogos: logoSets["video-audio"],
  },
  {
    name: "Sales & CRM",
    slug: "sales-crm",
    description: "Close more deals, faster",
    icon: Handshake,
    placeholderLogos: logoSets["sales-crm"],
  },
  {
    name: "Customer Support",
    slug: "customer-support",
    description: "Automate and scale support",
    icon: Headphones,
    placeholderLogos: logoSets["customer-support"],
  },
  {
    name: "Productivity & Ops",
    slug: "productivity-ops",
    description: "Streamline your workflows",
    icon: CheckSquare,
    placeholderLogos: logoSets["productivity-ops"],
  },
  {
    name: "Data & Analytics",
    slug: "data-analytics",
    description: "Turn data into decisions",
    icon: BarChart2,
    placeholderLogos: logoSets["data-analytics"],
  },
  {
    name: "Website & Landing Pages",
    slug: "website-landing-pages",
    description: "Build and optimize pages",
    icon: Globe,
    placeholderLogos: logoSets["website-landing-pages"],
  },
  {
    name: "Learning & Training",
    slug: "learning-training",
    description: "Upskill your team with AI",
    icon: GraduationCap,
    placeholderLogos: logoSets["learning-training"],
  },
];

// ─── Featured deals placeholder data ─────────────────────────────
const deals: Deal[] = [
  {
    id: "jasper",
    name: "Jasper AI",
    tag: "Content",
    deal: "50% off your first 3 months — generate blogs, ads & emails in seconds.",
    dealLabel: "50% OFF",
    imageSrc: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Creative writing workspace",
    href: "/directory?category=content-writing",
    website: "jasper.ai",
  },
  {
    id: "surfer",
    name: "Surfer SEO",
    tag: "SEO",
    deal: "Free 7-day trial — rank higher with AI-powered content optimization.",
    dealLabel: "FREE TRIAL",
    imageSrc: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Data analytics dashboard",
    href: "/directory?category=marketing-seo",
    website: "surferseo.com",
  },
  {
    id: "synthesia",
    name: "Synthesia",
    tag: "Video",
    deal: "20% off annual plan — create AI videos with a human presenter in minutes.",
    dealLabel: "20% OFF",
    imageSrc: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Video production setup",
    href: "/directory?category=video-audio",
    website: "synthesia.io",
  },
  {
    id: "hubspot",
    name: "HubSpot AI",
    tag: "Sales",
    deal: "Free CRM forever — AI-powered sales tools with no time limit.",
    dealLabel: "FREE",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Business team meeting",
    href: "/directory?category=sales-crm",
    website: "hubspot.com",
  },
  {
    id: "notion",
    name: "Notion AI",
    tag: "Productivity",
    deal: "3 months free on Plus — AI writing, summarizing & task management.",
    dealLabel: "3 MO FREE",
    imageSrc: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Organized workspace desk",
    href: "/directory?category=productivity-ops",
    website: "notion.so",
  },
  {
    id: "descript",
    name: "Descript",
    tag: "Audio",
    deal: "Free 1 hour/month — edit audio & video by editing text.",
    dealLabel: "FREE TIER",
    imageSrc: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Podcast microphone setup",
    href: "/directory?category=video-audio",
    website: "descript.com",
  },
];

export default function HomePage() {
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
              The AI Matching Engine for Everyone
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
            Stop Searching.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a066d4 0%, #df7afe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Start Doing More With AI.
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
            Whether you&apos;re a founder, freelancer, or just AI-curious —
            myAIMatch finds the exact tools you need to work smarter.{" "}
            <span style={{ color: "rgba(255,255,255,0.35)" }}>No jargon. No overwhelm. Just results.</span>
          </p>

          {/* CTA Row */}
          <div
            style={{
              animation: "heroFadeUp 0.7s 0.45s ease both",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* Primary CTA */}
            <Link href="/assessment" className="hero-cta-primary">
              Get Your Free AI Assessment
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Ghost CTA */}
            <Link href="/directory" className="hero-cta-ghost">
              Browse the Directory
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

      {/* ── Category Grid ─────────────────────────────────────────── */}
      {/* Reduced py-20 to py-12 for tighter visual hierarchy after search bar removal */}
      <section id="categories" className="relative overflow-hidden">
        <BeamsBackground intensity="subtle" className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              Explore AI Tools by Category
            </h2>
            <p className="text-center text-[#A0A0A0] text-sm mb-10">
              Browse 200+ curated AI tools across the categories your workflow needs most
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <CategoryCard
                    key={cat.slug}
                    name={cat.name}
                    slug={cat.slug}
                    description={cat.description}
                    icon={<Icon size={18} style={{ color: "#c084fc" }} />}
                    placeholderLogos={cat.placeholderLogos}
                  />
                );
              })}
            </div>
          </div>
        </BeamsBackground>
      </section>

      {/* ── Featured Deals Carousel ───────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Featured Deals
              </h2>
              <p className="text-sm mt-1" style={{ color: "#A0A0A0" }}>
                Exclusive offers on the best AI tools — updated regularly
              </p>
            </div>
          </div>
          <OfferCarousel deals={deals} />
        </div>
      </section>

      {/* ── Assessment Promo Banner ───────────────────────────────── */}
      <BannerCTA />
    </div>
  );
}
