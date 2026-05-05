export interface Tool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string[];
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

