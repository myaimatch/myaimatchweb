import type { Metadata } from "next";
import { OfferCarousel } from "@/components/ui/offer-carousel";
import type { Deal } from "@/components/ui/offer-carousel";
import { fetchAllCategories, fetchAllTools } from "@/lib/airtable";
import type { AirtableCategory, AirtableTool } from "@/lib/airtable";

export const metadata: Metadata = {
  title: "Deals",
  description: "Exclusive offers on the best AI tools, updated regularly.",
  openGraph: {
    title: "Deals | myAImatch",
    description: "Exclusive offers on the best AI tools, updated regularly.",
    url: "https://myaimatch.ai/deals",
    siteName: "myAImatch",
    type: "website",
  },
};

interface DealSection {
  category: AirtableCategory;
  deals: Deal[];
}

function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? "";
  }
}

function compareDeals(a: AirtableTool, b: AirtableTool) {
  const aRank = a.dealRank ?? Number.POSITIVE_INFINITY;
  const bRank = b.dealRank ?? Number.POSITIVE_INFINITY;

  if (aRank !== bRank) return aRank - bRank;
  return a.name.localeCompare(b.name);
}

function toDeal(tool: AirtableTool, category: AirtableCategory): Deal {
  const href = tool.affiliateLink || tool.websiteUrl || "/#directory";

  return {
    id: `${category.id}-${tool.id}`,
    name: tool.name,
    tag: category.name,
    promo: tool.promo ?? "",
    description: tool.dealDescription ?? tool.shortDescription,
    href,
    website: hostnameFromUrl(tool.websiteUrl),
    logoUrl: tool.logoUrl,
  };
}

function buildDealSections(tools: AirtableTool[], categories: AirtableCategory[]): DealSection[] {
  const activeDeals = tools.filter((tool) => tool.dealActive && tool.promo);

  return categories
    .map((category) => {
      const deals = activeDeals
        .filter((tool) => tool.category.includes(category.id))
        .sort(compareDeals)
        .map((tool) => toDeal(tool, category));

      return { category, deals };
    })
    .filter((section) => section.deals.length > 0);
}

export default async function DealsPage() {
  const [tools, categories] = await Promise.all([fetchAllTools(), fetchAllCategories()]);
  const dealSections = buildDealSections(tools, categories);

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
            background: "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(132,104,235,0.28) 0%, transparent 70%)",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8468EB] mb-4">
            Deals
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
            Featured <span className="text-[#8468EB]">Deals</span>
          </h1>
          <p className="text-base text-[#888] max-w-2xl mx-auto leading-relaxed">
            Exclusive offers on the best AI tools, updated regularly.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto space-y-16">
          {dealSections.length > 0 ? (
            dealSections.map((section) => (
              <div key={section.category.id} className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#8468EB] mb-2">
                    {section.deals.length} {section.deals.length === 1 ? "deal" : "deals"}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Top Deals in {section.category.name}
                  </h2>
                </div>
                <OfferCarousel deals={section.deals} />
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight">Deals are being refreshed</h2>
              <p className="mt-3 text-sm text-[#888]">
                Check back soon for active offers from the AI tools directory.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
