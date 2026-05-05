export type AffiliateLinkStatus = "active" | "approved" | "paused" | "expired" | "pending" | "rejected";
export type DealStatus = "active" | "draft" | "paused" | "expired" | "needs_review";
export type LinkSource = "directory" | "deals" | "assessment_email" | "admin_preview" | string;

export interface AffiliateLinkCandidate {
  id: string;
  url: string;
  status: AffiliateLinkStatus;
  priority?: number | null;
  approvedAt?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
}

export interface DealCandidate {
  id: string;
  affiliateLinkId?: string | null;
  url?: string | null;
  promoCode?: string | null;
  status: DealStatus;
  activeFrom?: string | null;
  activeUntil?: string | null;
  rank?: number | null;
}

export interface AffiliateResolutionInput {
  slug: string;
  websiteUrl: string;
  affiliateLinks: AffiliateLinkCandidate[];
  deals: DealCandidate[];
  now?: Date;
  source?: LinkSource;
}

export interface AffiliateResolution {
  destinationUrl: string;
  linkId: string | null;
  dealId: string | null;
  hasAffiliate: boolean;
  promoCode: string | null;
  reason: "deal" | "affiliate_link" | "website";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isWithinWindow(
  now: Date,
  startsAt?: string | null,
  endsAt?: string | null,
) {
  const time = now.getTime();
  if (startsAt && new Date(startsAt).getTime() > time) return false;
  if (endsAt && new Date(endsAt).getTime() < time) return false;
  return true;
}

function byPriorityThenDate<T extends { priority?: number | null; rank?: number | null; approvedAt?: string | null }>(
  a: T,
  b: T,
) {
  const aRank = a.rank ?? a.priority ?? Number.POSITIVE_INFINITY;
  const bRank = b.rank ?? b.priority ?? Number.POSITIVE_INFINITY;
  if (aRank !== bRank) return aRank - bRank;

  const aApproved = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
  const bApproved = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
  return bApproved - aApproved;
}

function hasPublicUrl(value?: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function activeAffiliateLinks(input: AffiliateResolutionInput) {
  const now = input.now ?? new Date();

  return input.affiliateLinks
    .filter((link) => link.status === "active")
    .filter((link) => hasPublicUrl(link.url))
    .filter((link) => !!link.approvedAt)
    .filter((link) => isWithinWindow(now, link.validFrom, link.validUntil))
    .sort(byPriorityThenDate);
}

export function buildGoHref(slugOrName: string, source?: LinkSource, recommendationId?: string | null) {
  const slug = slugify(slugOrName);
  const params = new URLSearchParams();
  if (source) params.set("src", source);
  if (recommendationId) params.set("rid", recommendationId);
  const query = params.toString();
  return `/go/${slug}${query ? `?${query}` : ""}`;
}

export function resolveToolDestination(input: AffiliateResolutionInput): AffiliateResolution {
  const now = input.now ?? new Date();
  const activeLinks = activeAffiliateLinks(input);

  if (input.source === "deals") {
    const activeDeals = input.deals
      .filter((deal) => deal.status === "active")
      .filter((deal) => isWithinWindow(now, deal.activeFrom, deal.activeUntil))
      .filter((deal) => hasPublicUrl(deal.url) || !!deal.affiliateLinkId)
      .sort(byPriorityThenDate);

    const deal = activeDeals.find((candidate) => {
      if (!candidate.affiliateLinkId) return hasPublicUrl(candidate.url);
      return activeLinks.some((link) => link.id === candidate.affiliateLinkId);
    });

    if (deal) {
      const linkedAffiliate = deal.affiliateLinkId
        ? activeLinks.find((link) => link.id === deal.affiliateLinkId)
        : null;

      return {
        destinationUrl: deal.url || linkedAffiliate?.url || input.websiteUrl,
        linkId: linkedAffiliate?.id ?? deal.affiliateLinkId ?? null,
        dealId: deal.id,
        hasAffiliate: !!linkedAffiliate || !!deal.affiliateLinkId,
        promoCode: deal.promoCode ?? null,
        reason: "deal",
      };
    }
  }

  const affiliateLink = activeLinks[0];
  if (affiliateLink) {
    return {
      destinationUrl: affiliateLink.url,
      linkId: affiliateLink.id,
      dealId: null,
      hasAffiliate: true,
      promoCode: null,
      reason: "affiliate_link",
    };
  }

  return {
    destinationUrl: input.websiteUrl,
    linkId: null,
    dealId: null,
    hasAffiliate: false,
    promoCode: null,
    reason: "website",
  };
}
