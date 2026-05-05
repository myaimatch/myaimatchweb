import assert from "node:assert/strict";
import {
  buildGoHref,
  resolveToolDestination,
  type AffiliateResolutionInput,
} from "./affiliate-links";

const now = new Date("2026-05-05T12:00:00.000Z");

function input(overrides: Partial<AffiliateResolutionInput> = {}): AffiliateResolutionInput {
  return {
    slug: "notion",
    websiteUrl: "https://www.notion.so",
    affiliateLinks: [],
    deals: [],
    now,
    source: "directory",
    ...overrides,
  };
}

assert.equal(buildGoHref("Notion AI", "assessment_email", "rec_123"), "/go/notion-ai?src=assessment_email&rid=rec_123");
assert.equal(buildGoHref("ChatGPT"), "/go/chatgpt");

assert.deepEqual(
  resolveToolDestination(
    input({
      affiliateLinks: [
        {
          id: "low",
          url: "https://partners.example.com/low",
          status: "active",
          priority: 20,
          approvedAt: "2026-05-01T00:00:00.000Z",
        },
        {
          id: "high",
          url: "https://partners.example.com/high",
          status: "active",
          priority: 5,
          approvedAt: "2026-05-01T00:00:00.000Z",
        },
      ],
    }),
  ),
  {
    destinationUrl: "https://partners.example.com/high",
    linkId: "high",
    dealId: null,
    hasAffiliate: true,
    promoCode: null,
    reason: "affiliate_link",
  },
);

assert.deepEqual(
  resolveToolDestination(
    input({
      source: "deals",
      affiliateLinks: [
        {
          id: "aff_1",
          url: "https://partners.example.com/default",
          status: "active",
          priority: 1,
          approvedAt: "2026-05-01T00:00:00.000Z",
        },
      ],
      deals: [
        {
          id: "deal_expired",
          affiliateLinkId: "aff_1",
          url: "https://partners.example.com/expired",
          promoCode: "OLD",
          status: "active",
          activeFrom: "2026-04-01T00:00:00.000Z",
          activeUntil: "2026-05-01T00:00:00.000Z",
          rank: 1,
        },
        {
          id: "deal_live",
          affiliateLinkId: "aff_1",
          url: "https://partners.example.com/live",
          promoCode: "LIVE20",
          status: "active",
          activeFrom: "2026-05-01T00:00:00.000Z",
          activeUntil: "2026-06-01T00:00:00.000Z",
          rank: 2,
        },
      ],
    }),
  ),
  {
    destinationUrl: "https://partners.example.com/live",
    linkId: "aff_1",
    dealId: "deal_live",
    hasAffiliate: true,
    promoCode: "LIVE20",
    reason: "deal",
  },
);

assert.deepEqual(resolveToolDestination(input()), {
  destinationUrl: "https://www.notion.so",
  linkId: null,
  dealId: null,
  hasAffiliate: false,
  promoCode: null,
  reason: "website",
});
