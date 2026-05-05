export interface TaxonomySubcategory {
  name: string;
  slug: string;
  description?: string;
}

export interface TaxonomyOutcome {
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: TaxonomySubcategory[];
}

function stripParentheticals(value: string) {
  return value.replace(/\s*\([^)]*\)/g, "");
}

export function slugifyTaxonomyLabel(label: string) {
  return stripParentheticals(label)
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function subcategory(name: string, description?: string): TaxonomySubcategory {
  return {
    name,
    slug: slugifyTaxonomyLabel(name),
    description,
  };
}

function outcome(
  name: string,
  description: string,
  icon: string,
  subcategories: TaxonomySubcategory[],
): TaxonomyOutcome {
  return {
    name,
    slug: slugifyTaxonomyLabel(name),
    description,
    icon,
    subcategories,
  };
}

export const OUTCOME_TAXONOMY = [
  outcome("Create Content", "Write, draft, generate, or repurpose text.", "PenLine", [
    subcategory("Long-form writing (articles, blogs)", "Articles, blogs, and deeper written assets."),
    subcategory("Social posts"),
    subcategory("Marketing & ad copy"),
    subcategory("Email & newsletters"),
    subcategory("Scripts & screenplays"),
    subcategory("Translation & localization"),
    subcategory("Content repurposing"),
  ]),
  outcome("Design Visuals", "Make images, graphics, brand assets, slides, and mockups.", "Palette", [
    subcategory("Generate images"),
    subcategory("Edit & retouch photos"),
    subcategory("Brand & logo design"),
    subcategory("Slides & decks"),
    subcategory("UI & web mockups"),
    subcategory("Icons & illustrations"),
  ]),
  outcome("Produce Video & Audio", "Record, edit, dub, transcribe, score, and publish media.", "Video", [
    subcategory("Generate video"),
    subcategory("Edit & cut video"),
    subcategory("AI avatars & spokespersons"),
    subcategory("Voice generation & dubbing"),
    subcategory("Transcribe & caption"),
    subcategory("Music & sound design"),
    subcategory("Podcast production"),
  ]),
  outcome("Build Software", "Ship code, sites, or apps with or without code.", "Code2", [
    subcategory("Code completion & pair programming"),
    subcategory("Generate full apps & sites"),
    subcategory("Build without code"),
    subcategory("Debug & code review"),
    subcategory("Test & QA automation"),
    subcategory("Deploy & monitor"),
  ]),
  outcome("Build AI Agents", "Create chatbots, voice agents, copilots, and autonomous workers.", "Bot", [
    subcategory("Build chatbots"),
    subcategory("Build voice agents"),
    subcategory("Build internal copilots"),
    subcategory("Multi-step agentic workflows"),
    subcategory("RAG & knowledge bases"),
    subcategory("Custom GPTs / assistants"),
  ]),
  outcome("Automate Workflows", "Connect apps, scrape, process documents, and run repeatable flows.", "Workflow", [
    subcategory("Connect apps"),
    subcategory("Web scraping & data entry"),
    subcategory("Document processing & OCR"),
    subcategory("Background jobs & scheduled tasks"),
    subcategory("Custom automation builders"),
  ]),
  outcome("Grow Audience", "Get found organically through search, social, community, and reputation.", "TrendingUp", [
    subcategory("SEO research & audits"),
    subcategory("On-page SEO optimization"),
    subcategory("Content for SEO"),
    subcategory("Social media growth"),
    subcategory("Influencer & community"),
    subcategory("Reputation & reviews"),
  ]),
  outcome("Launch Campaigns", "Run paid, email, outbound, landing page, and funnel campaigns end to end.", "Rocket", [
    subcategory("Email marketing"),
    subcategory("Paid ads (creative & buying)"),
    subcategory("Outbound & cold email"),
    subcategory("Landing pages"),
    subcategory("A/B testing & CRO"),
    subcategory("Funnels & sequences"),
  ]),
  outcome("Sell & Close Deals", "Prospect, qualify, manage pipeline, and close revenue.", "Handshake", [
    subcategory("Prospect & enrich leads"),
    subcategory("CRM & pipeline management"),
    subcategory("Meeting intelligence"),
    subcategory("Proposal & quoting"),
    subcategory("Revenue intelligence & forecasting"),
  ]),
  outcome("Support Customers", "Answer, deflect, and manage customer help across chat, tickets, and voice.", "Headphones", [
    subcategory("AI chatbots & live chat"),
    subcategory("Helpdesk & ticketing"),
    subcategory("Voice support agents"),
    subcategory("Knowledge base & self-serve"),
    subcategory("Feedback, NPS & VoC"),
  ]),
  outcome("Analyze Data", "Turn data into dashboards, insights, forecasts, and answers.", "BarChart2", [
    subcategory("Dashboards & BI"),
    subcategory("Spreadsheet AI"),
    subcategory("Forecasting & prediction"),
    subcategory("Customer & product analytics"),
    subcategory("Document Q&A (chat with PDFs)"),
  ]),
  outcome("Research & Learn", "Study, summarize, take notes, and build knowledge faster.", "GraduationCap", [
    subcategory("Deep research"),
    subcategory("Summarize papers & docs"),
    subcategory("Study & flashcards"),
    subcategory("Note-taking & PKM"),
    subcategory("Tutoring, courses & languages"),
  ]),
  outcome("Plan & Collaborate", "Manage tasks, docs, calendar, meetings, and team communication.", "Users", [
    subcategory("Tasks & project management"),
    subcategory("Docs & wikis"),
    subcategory("OKRs & goals"),
    subcategory("Personal productivity"),
    subcategory("Time & calendar management"),
    subcategory("Meetings & AI notetakers"),
    subcategory("Async video & internal comms"),
  ]),
  outcome("Run Operations", "Handle finance, HR, legal, admin, compliance, and operational work.", "Building", [
    subcategory("Bookkeeping & finance"),
    subcategory("Expenses & spend management"),
    subcategory("Recruit & hire (HR/ATS)"),
    subcategory("Legal & contracts"),
    subcategory("Admin & executive assistant"),
    subcategory("Compliance & risk"),
  ]),
] as const satisfies readonly TaxonomyOutcome[];

export function getAllSubcategories() {
  return OUTCOME_TAXONOMY.flatMap((parent) =>
    parent.subcategories.map((child) => ({
      ...child,
      outcomeName: parent.name,
      outcomeSlug: parent.slug,
    })),
  );
}
