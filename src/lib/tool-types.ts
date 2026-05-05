export interface Tool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  outcomes: ToolOutcomeRef[];
  primaryOutcomeId?: string;
  subcategories: ToolSubcategoryRef[];
  /** @deprecated Use outcomes instead. Kept during the outcome taxonomy rollout. */
  category: string[];
  /** @deprecated Use subcategories instead. Kept during the outcome taxonomy rollout. */
  subcategory?: string;
  websiteUrl: string;
  affiliateLink?: string;
  affiliateStatus?: string;
  logoUrl?: string;
  pricingSummary?: string;
  communityReputation?: number;
  featured: boolean;
  dealActive: boolean;
  promo?: string;
  dealDescription?: string;
  dealRank?: number;
  supportLanguages?: string[];
  uiLanguages?: string[];
  foundedYear?: number;
  hasFreePlan?: boolean;
  trialDays?: number;
  bestFor?: string;
  hasApi?: boolean;
  integrations?: string[];
  companyHq?: string;
  employeeCount?: string;
  gdprCompliant?: boolean;
  hasMobileApp?: boolean;
  soc2Certified?: boolean;
  minMonthlyPrice?: number;
  maxMonthlyPrice?: number;
}

export interface ToolOutcomeRef {
  id: string;
  isPrimary: boolean;
}

export interface ToolSubcategoryRef {
  id: string;
  name: string;
  slug: string;
  outcomeId: string;
}

export interface Outcome {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

export interface Subcategory {
  id: string;
  outcomeId: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

/** @deprecated Use Outcome instead. */
export type Category = Outcome;
