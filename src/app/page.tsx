import Link from "next/link";
import type { Metadata } from "next";
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
  Search,
} from "lucide-react";

export const metadata: Metadata = {
  title: "myAIMatch — The AI Tools Directory for Businesses",
  description:
    "Browse, compare, and find the right AI tools for your business. Hand-picked and organized by function — not by who pays to be listed.",
  openGraph: {
    title: "myAIMatch — The AI Tools Directory for Businesses",
    description:
      "Browse, compare, and find the right AI tools for your business. Hand-picked and organized by function — not by who pays to be listed.",
    url: "https://myaimatch.ai",
    type: "website",
  },
};

// ─── Placeholder logo sets (14 per category) ─────────────────────
// Real logos will come from Airtable. These simulate a tool logo grid.
const mkLogos = (seeds: { i: string; bg: string; color: string }[]) =>
  seeds.map((s) => ({ initials: s.i, bg: s.bg, color: s.color }));

const logoSets = {
  "marketing-seo": mkLogos([
    { i: "Sm", bg: "#FF6B2B", color: "#fff" },
    { i: "AH", bg: "#2563EB", color: "#fff" },
    { i: "SE", bg: "#10B981", color: "#fff" },
    { i: "Mk", bg: "#F59E0B", color: "#111" },
    { i: "Gs", bg: "#4285F4", color: "#fff" },
    { i: "Mb", bg: "#6366F1", color: "#fff" },
    { i: "Hs", bg: "#FF7A59", color: "#fff" },
    { i: "Kw", bg: "#0EA5E9", color: "#fff" },
    { i: "Sp", bg: "#8B5CF6", color: "#fff" },
    { i: "Cl", bg: "#EC4899", color: "#fff" },
    { i: "Lm", bg: "#14B8A6", color: "#fff" },
    { i: "Rb", bg: "#F97316", color: "#fff" },
    { i: "Mr", bg: "#06B6D4", color: "#fff" },
    { i: "Wr", bg: "#84CC16", color: "#111" },
  ]),
  "content-writing": mkLogos([
    { i: "Js", bg: "#6366F1", color: "#fff" },
    { i: "Cp", bg: "#10B981", color: "#fff" },
    { i: "Wr", bg: "#F59E0B", color: "#111" },
    { i: "Ry", bg: "#EC4899", color: "#fff" },
    { i: "Su", bg: "#0EA5E9", color: "#fff" },
    { i: "Cl", bg: "#8B5CF6", color: "#fff" },
    { i: "Gm", bg: "#14B8A6", color: "#fff" },
    { i: "Cn", bg: "#FF6B2B", color: "#fff" },
    { i: "Bz", bg: "#2563EB", color: "#fff" },
    { i: "Nl", bg: "#06B6D4", color: "#fff" },
    { i: "Hy", bg: "#84CC16", color: "#111" },
    { i: "Wt", bg: "#F97316", color: "#fff" },
    { i: "Pf", bg: "#4285F4", color: "#fff" },
    { i: "Kl", bg: "#EF4444", color: "#fff" },
  ]),
  "design-creative": mkLogos([
    { i: "Md", bg: "#FF7262", color: "#fff" },
    { i: "Cv", bg: "#00C4B4", color: "#fff" },
    { i: "Ad", bg: "#FF0000", color: "#fff" },
    { i: "Fg", bg: "#A259FF", color: "#fff" },
    { i: "Sk", bg: "#F7B500", color: "#111" },
    { i: "Dr", bg: "#E44D26", color: "#fff" },
    { i: "Rm", bg: "#06B6D4", color: "#fff" },
    { i: "Ps", bg: "#2AF598", color: "#111" },
    { i: "Il", bg: "#FF9A00", color: "#fff" },
    { i: "Cr", bg: "#EC4899", color: "#fff" },
    { i: "Sp", bg: "#6366F1", color: "#fff" },
    { i: "Vk", bg: "#10B981", color: "#fff" },
    { i: "Nv", bg: "#8B5CF6", color: "#fff" },
    { i: "Lx", bg: "#F59E0B", color: "#111" },
  ]),
  "video-audio": mkLogos([
    { i: "Sy", bg: "#5865F2", color: "#fff" },
    { i: "Dc", bg: "#DB4437", color: "#fff" },
    { i: "Rv", bg: "#00C4B4", color: "#fff" },
    { i: "Lm", bg: "#FF6B2B", color: "#fff" },
    { i: "Ee", bg: "#2563EB", color: "#fff" },
    { i: "Mu", bg: "#10B981", color: "#fff" },
    { i: "Ca", bg: "#8B5CF6", color: "#fff" },
    { i: "Ec", bg: "#EC4899", color: "#fff" },
    { i: "Vc", bg: "#F59E0B", color: "#111" },
    { i: "Ht", bg: "#14B8A6", color: "#fff" },
    { i: "Wv", bg: "#06B6D4", color: "#fff" },
    { i: "Ss", bg: "#84CC16", color: "#111" },
    { i: "Pp", bg: "#EF4444", color: "#fff" },
    { i: "Fl", bg: "#F97316", color: "#fff" },
  ]),
  "sales-crm": mkLogos([
    { i: "Sf", bg: "#00A1E0", color: "#fff" },
    { i: "Hs", bg: "#FF7A59", color: "#fff" },
    { i: "Pp", bg: "#2563EB", color: "#fff" },
    { i: "Cl", bg: "#10B981", color: "#fff" },
    { i: "Ol", bg: "#8B5CF6", color: "#fff" },
    { i: "Zp", bg: "#F59E0B", color: "#111" },
    { i: "Ga", bg: "#EC4899", color: "#fff" },
    { i: "At", bg: "#14B8A6", color: "#fff" },
    { i: "Nd", bg: "#EF4444", color: "#fff" },
    { i: "Lr", bg: "#06B6D4", color: "#fff" },
    { i: "Kr", bg: "#F97316", color: "#fff" },
    { i: "Mn", bg: "#84CC16", color: "#111" },
    { i: "Ou", bg: "#4285F4", color: "#fff" },
    { i: "Rs", bg: "#FF6B2B", color: "#fff" },
  ]),
  "customer-support": mkLogos([
    { i: "It", bg: "#2563EB", color: "#fff" },
    { i: "Zd", bg: "#03363D", color: "#fff" },
    { i: "Ic", bg: "#6366F1", color: "#fff" },
    { i: "Fr", bg: "#F59E0B", color: "#111" },
    { i: "Gp", bg: "#10B981", color: "#fff" },
    { i: "Cr", bg: "#EC4899", color: "#fff" },
    { i: "Lc", bg: "#FF6B2B", color: "#fff" },
    { i: "Dr", bg: "#14B8A6", color: "#fff" },
    { i: "Hl", bg: "#8B5CF6", color: "#fff" },
    { i: "Kn", bg: "#0EA5E9", color: "#fff" },
    { i: "Vo", bg: "#EF4444", color: "#fff" },
    { i: "Cy", bg: "#84CC16", color: "#111" },
    { i: "Tn", bg: "#F97316", color: "#fff" },
    { i: "Sp", bg: "#06B6D4", color: "#fff" },
  ]),
  "productivity-ops": mkLogos([
    { i: "Nt", bg: "#000000", color: "#fff" },
    { i: "Sl", bg: "#4A154B", color: "#fff" },
    { i: "As", bg: "#FC636B", color: "#fff" },
    { i: "Mo", bg: "#6366F1", color: "#fff" },
    { i: "Cl", bg: "#2563EB", color: "#fff" },
    { i: "Ai", bg: "#10B981", color: "#fff" },
    { i: "Zm", bg: "#2D8CFF", color: "#fff" },
    { i: "Zp", bg: "#F59E0B", color: "#111" },
    { i: "Lp", bg: "#EC4899", color: "#fff" },
    { i: "Tb", bg: "#FF6B2B", color: "#fff" },
    { i: "Cr", bg: "#8B5CF6", color: "#fff" },
    { i: "Od", bg: "#14B8A6", color: "#fff" },
    { i: "Re", bg: "#EF4444", color: "#fff" },
    { i: "Sc", bg: "#84CC16", color: "#111" },
  ]),
  "data-analytics": mkLogos([
    { i: "Ga", bg: "#E37400", color: "#fff" },
    { i: "Tb", bg: "#0078D4", color: "#fff" },
    { i: "Lk", bg: "#6366F1", color: "#fff" },
    { i: "Mx", bg: "#10B981", color: "#fff" },
    { i: "Dg", bg: "#8B5CF6", color: "#fff" },
    { i: "Bq", bg: "#4285F4", color: "#fff" },
    { i: "Pw", bg: "#F2C811", color: "#111" },
    { i: "Ht", bg: "#EC4899", color: "#fff" },
    { i: "Sp", bg: "#FF6B2B", color: "#fff" },
    { i: "Am", bg: "#232F3E", color: "#fff" },
    { i: "Rf", bg: "#14B8A6", color: "#fff" },
    { i: "Mt", bg: "#EF4444", color: "#fff" },
    { i: "Dc", bg: "#0EA5E9", color: "#fff" },
    { i: "Md", bg: "#84CC16", color: "#111" },
  ]),
  "website-landing-pages": mkLogos([
    { i: "Wf", bg: "#4353FF", color: "#fff" },
    { i: "Fr", bg: "#2563EB", color: "#fff" },
    { i: "Wp", bg: "#21759B", color: "#fff" },
    { i: "Sq", bg: "#000000", color: "#fff" },
    { i: "Sw", bg: "#FF6B2B", color: "#fff" },
    { i: "Ub", bg: "#6366F1", color: "#fff" },
    { i: "Sh", bg: "#10B981", color: "#fff" },
    { i: "Lp", bg: "#EC4899", color: "#fff" },
    { i: "Cm", bg: "#8B5CF6", color: "#fff" },
    { i: "El", bg: "#F59E0B", color: "#111" },
    { i: "Bz", bg: "#14B8A6", color: "#fff" },
    { i: "Cs", bg: "#EF4444", color: "#fff" },
    { i: "Hb", bg: "#0EA5E9", color: "#fff" },
    { i: "Vr", bg: "#84CC16", color: "#111" },
  ]),
  "learning-training": mkLogos([
    { i: "Co", bg: "#F59E0B", color: "#111" },
    { i: "Ud", bg: "#A435F0", color: "#fff" },
    { i: "Ll", bg: "#58CC02", color: "#fff" },
    { i: "Sk", bg: "#00A0D2", color: "#fff" },
    { i: "Kh", bg: "#14BF96", color: "#fff" },
    { i: "Mg", bg: "#6366F1", color: "#fff" },
    { i: "Th", bg: "#EC4899", color: "#fff" },
    { i: "Lv", bg: "#2563EB", color: "#fff" },
    { i: "Ep", bg: "#FF6B2B", color: "#fff" },
    { i: "Ac", bg: "#10B981", color: "#fff" },
    { i: "Dc", bg: "#8B5CF6", color: "#fff" },
    { i: "Bk", bg: "#EF4444", color: "#fff" },
    { i: "Sp", bg: "#0EA5E9", color: "#fff" },
    { i: "Rc", bg: "#84CC16", color: "#111" },
  ]),
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
const deals = [
  { name: "Jasper AI", deal: "50% off first 3 months", tag: "Content" },
  { name: "Surfer SEO", deal: "Free 7-day trial", tag: "SEO" },
  { name: "Synthesia", deal: "20% off annual plan", tag: "Video" },
  { name: "HubSpot AI", deal: "Free CRM forever", tag: "Sales" },
  { name: "Notion AI", deal: "3 months free on Plus", tag: "Productivity" },
  { name: "Descript", deal: "Free 1 hour/month", tag: "Audio" },
];

export default function HomePage() {
  return (
    <div className="bg-[#131313] text-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-36 px-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.15) 0%, #131313 70%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            The AI Tools Directory Built for{" "}
            <span className="text-[#8468EB]">Businesses That Don&apos;t Have Time to Guess</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A0A0A0] max-w-2xl mx-auto mb-10 leading-relaxed">
            Every tool is hand-picked and organized by business function — not
            by who pays to be listed. Browse, compare, and find what actually
            works for your team.
          </p>
          <Link
            href="/directory"
            className="inline-block text-white font-semibold text-base px-8 py-4 rounded-full transition-all hover:opacity-90 hover:scale-105"
            style={{
              background:
                "linear-gradient(156deg, #232323 15.44%, #8468EB 111.39%)",
              border: "1px solid rgba(132,104,235,0.4)",
            }}
          >
            Browse the Directory
          </Link>
          <p className="mt-4 text-sm text-[#A0A0A0]">
            or{" "}
            <a
              href="#categories"
              className="underline text-white hover:text-[#8468EB] transition-colors"
            >
              browse by category below
            </a>
          </p>
        </div>
      </section>

      {/* ── Search Bar ───────────────────────────────────────────── */}
      <section className="px-4 pb-20 -mt-4">
        <div className="max-w-2xl mx-auto relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
            size={20}
          />
          <input
            type="text"
            placeholder="What do you need AI to help with?"
            className="w-full bg-[#232323] border border-[#343434] text-white placeholder-[#A0A0A0] rounded-full pl-13 pr-6 py-4 text-base outline-none focus:border-[#8468EB] focus:ring-1 focus:ring-[#8468EB] transition-colors"
            style={{ paddingLeft: "3.25rem" }}
          />
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────── */}
      <section id="categories" className="px-4 py-20 bg-[#232323]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.slug}
                  className="group flex flex-col gap-5 p-6 bg-[#2F2F2F] rounded-2xl border border-[#343434] hover:border-[#8468EB] transition-all hover:shadow-lg hover:shadow-[#8468EB]/10"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#343434] flex items-center justify-center group-hover:bg-[#8468EB]/20 transition-colors flex-shrink-0">
                      <Icon size={18} className="text-[#8468EB]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-snug">
                        {cat.name}
                      </p>
                      <p className="text-[#A0A0A0] text-xs mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Tool logo placeholders — 14 minimum */}
                  <div className="flex flex-wrap gap-2">
                    {cat.placeholderLogos.map((logo, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: logo.bg, color: logo.color }}
                      >
                        {logo.initials}
                      </div>
                    ))}
                  </div>

                  {/* View more */}
                  <Link
                    href={`/directory?category=${cat.slug}`}
                    className="text-[#8468EB] text-sm font-medium hover:text-white transition-colors flex items-center gap-1 mt-auto"
                  >
                    View more →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Deals Carousel ───────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Featured Deals
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {deals.map((deal) => (
              <div
                key={deal.name}
                className="min-w-[240px] flex-shrink-0 bg-[#2F2F2F] rounded-2xl border border-[#343434] p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#343434] flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {deal.name}
                    </p>
                    <span className="text-xs text-[#8468EB] font-medium">
                      {deal.tag}
                    </span>
                  </div>
                </div>
                <p className="text-[#A0A0A0] text-sm">{deal.deal}</p>
                <button className="mt-auto w-full text-center text-sm font-semibold text-white py-2 rounded-full border border-[#8468EB] hover:bg-[#8468EB] transition-colors">
                  Get Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assessment Promo Banner ───────────────────────────────── */}
      <section className="px-4 md:px-8 py-16">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #7B5FD6 0%, #9B7FFF 50%, #8468EB 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10 px-8 md:px-14 py-12 md:py-16">
            {/* Left — text content */}
            <div className="flex flex-col gap-5 md:w-3/5 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                Not Sure Which Tools Are Right for You?
              </h2>
              <p className="text-white/80 text-base leading-relaxed">
                Most businesses waste months testing tools that were never a
                fit. Tell us about your workflow and team — we&apos;ll match you
                to the exact tools that solve your actual problems.
              </p>
              <p className="text-white font-medium text-sm">
                Free. 2 minutes. No sales call required.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/assessment"
                  className="inline-block bg-white font-semibold text-base px-8 py-4 rounded-full transition-all hover:opacity-90 hover:scale-105"
                  style={{ color: "#131313" }}
                >
                  Get My Free AI Match
                </Link>
              </div>
            </div>

            {/* Right — decorative orbit rings */}
            <div className="relative hidden md:flex items-center justify-center md:w-2/5 min-h-[200px]">
              <div className="absolute w-56 h-56 rounded-full border border-white/10" />
              <div className="absolute w-40 h-40 rounded-full border border-white/20" />
              <div className="absolute w-24 h-24 rounded-full border border-white/30" />
              <div className="absolute w-10 h-10 rounded-full bg-white/10 border border-white/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
