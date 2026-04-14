import type { Metadata } from "next";
import { OfferCarousel } from "@/components/ui/offer-carousel";
import type { Deal } from "@/components/ui/offer-carousel";

export const metadata: Metadata = {
  title: "Deals",
  description: "Exclusive offers on the best AI tools, updated regularly.",
  openGraph: {
    title: "Deals | myAIMatch",
    description: "Exclusive offers on the best AI tools, updated regularly.",
    url: "https://myaimatch.ai/deals",
    siteName: "myAIMatch",
    type: "website",
  },
};

const deals: Deal[] = [
  {
    id: "jasper",
    name: "Jasper AI",
    tag: "Content",
    deal: "50% off your first 3 months - generate blogs, ads & emails in seconds.",
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
    deal: "Free 7-day trial - rank higher with AI-powered content optimization.",
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
    deal: "20% off annual plan - create AI videos with a human presenter in minutes.",
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
    deal: "Free CRM forever - AI-powered sales tools with no time limit.",
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
    deal: "3 months free on Plus - AI writing, summarizing & task management.",
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
    deal: "Free 1 hour/month - edit audio & video by editing text.",
    dealLabel: "FREE TIER",
    imageSrc: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Podcast microphone setup",
    href: "/directory?category=video-audio",
    website: "descript.com",
  },
];

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-4 pt-16 pb-12 text-center border-b border-[#1a1a1a]">
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "350px",
            background: "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(129,74,200,0.28) 0%, transparent 70%)",
            animation: "orbPulse 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to bottom, transparent, #000000)",
            pointerEvents: "none",
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#814ac8] mb-4">
            Deals
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
            Featured <span className="text-[#814ac8]">Deals</span>
          </h1>
          <p className="text-base text-[#888] max-w-2xl mx-auto leading-relaxed">
            Exclusive offers on the best AI tools, updated regularly.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <OfferCarousel deals={deals} />
        </div>
      </section>
    </div>
  );
}
