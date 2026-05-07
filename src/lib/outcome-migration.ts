import { OUTCOME_TAXONOMY, getAllSubcategories } from "./outcome-taxonomy";

export type OutcomeMigrationConfidence = "high" | "medium" | "low";

export interface OutcomeMigrationToolInput {
  id?: string;
  name: string;
  slug: string;
  currentCategories: string[];
  currentSubcategory: string;
  shortDescription: string;
  fullDescription: string;
}

export interface OutcomeMigrationProposal {
  toolId?: string;
  toolName: string;
  toolSlug: string;
  primaryOutcomeSlug: string;
  secondaryOutcomeSlugs: string[];
  subcategorySlugs: string[];
  confidence: OutcomeMigrationConfidence;
  reason: string;
}

export interface OutcomeMigrationValidation {
  valid: boolean;
  errors: string[];
}

const OUTCOME_SLUGS = new Set(OUTCOME_TAXONOMY.map((outcome) => outcome.slug));
const SUBCATEGORY_SLUGS = new Set(getAllSubcategories().map((subcategory) => subcategory.slug));

const TOOL_OVERRIDES: Record<string, Omit<OutcomeMigrationProposal, "toolId" | "toolName" | "toolSlug">> = {
  bill: {
    primaryOutcomeSlug: "run-operations",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["bookkeeping-finance"],
    confidence: "high",
    reason: "Bill is an AP/AR finance operations tool.",
  },
  ramp: {
    primaryOutcomeSlug: "run-operations",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["expenses-spend-management"],
    confidence: "high",
    reason: "Ramp is primarily spend management and finance operations.",
  },
  zapier: {
    primaryOutcomeSlug: "automate-workflows",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["connect-apps"],
    confidence: "high",
    reason: "Zapier is deterministic app-to-app workflow automation.",
  },
  make: {
    primaryOutcomeSlug: "automate-workflows",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["connect-apps"],
    confidence: "high",
    reason: "Make is deterministic app-to-app workflow automation.",
  },
  n8n: {
    primaryOutcomeSlug: "automate-workflows",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["connect-apps"],
    confidence: "high",
    reason: "n8n is deterministic app-to-app workflow automation.",
  },
  "cassidy-ai": {
    primaryOutcomeSlug: "build-ai-agents",
    secondaryOutcomeSlugs: ["automate-workflows"],
    subcategorySlugs: ["build-internal-copilots", "rag-knowledge-bases"],
    confidence: "high",
    reason: "Cassidy AI builds internal AI assistants and copilots over business context.",
  },
  "chatgpt-app": {
    primaryOutcomeSlug: "create-content",
    secondaryOutcomeSlugs: ["research-learn", "build-ai-agents"],
    subcategorySlugs: ["long-form-writing"],
    confidence: "high",
    reason: "ChatGPT is a broad assistant, but the approved taxonomy lists it under Create Content.",
  },
  jasper: {
    primaryOutcomeSlug: "create-content",
    secondaryOutcomeSlugs: ["launch-campaigns"],
    subcategorySlugs: ["marketing-ad-copy"],
    confidence: "high",
    reason: "Jasper is primarily a marketing and content writing platform.",
  },
  "deepl-translate": {
    primaryOutcomeSlug: "create-content",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["translation-localization"],
    confidence: "high",
    reason: "DeepL is primarily translation and localization.",
  },
  diffit: {
    primaryOutcomeSlug: "research-learn",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["tutoring-courses-languages"],
    confidence: "high",
    reason: "Diffit creates learning materials for education workflows.",
  },
  "worksheet-ai": {
    primaryOutcomeSlug: "research-learn",
    secondaryOutcomeSlugs: ["create-content"],
    subcategorySlugs: ["study-flashcards"],
    confidence: "high",
    reason: "Worksheet AI creates learning and study materials.",
  },
};

function textIncludes(input: string, words: string[]) {
  return words.some((word) => input.includes(word));
}

function makeProposal(
  input: OutcomeMigrationToolInput,
  proposal: Omit<OutcomeMigrationProposal, "toolId" | "toolName" | "toolSlug">,
): OutcomeMigrationProposal {
  return {
    toolId: input.id,
    toolName: input.name,
    toolSlug: input.slug,
    ...proposal,
  };
}

export function classifyToolForOutcomeMigration(input: OutcomeMigrationToolInput): OutcomeMigrationProposal {
  const override = TOOL_OVERRIDES[input.slug];
  if (override) return makeProposal(input, override);

  const categories = input.currentCategories.join(" ").toLowerCase();
  const haystack = [
    input.name,
    input.slug,
    input.currentSubcategory,
    input.shortDescription,
    input.fullDescription,
    categories,
  ].join(" ").toLowerCase();

  if (textIncludes(haystack, ["seo", "semrush", "ahrefs", "answer", "brandwatch", "reputation", "reviews"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "grow-audience",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["social", "brandwatch"])
        ? ["social-media-growth"]
        : ["seo-research-audits"],
      confidence: "medium",
      reason: "The tool is positioned around organic visibility, SEO, social, or reputation growth.",
    });
  }

  if (textIncludes(haystack, ["email", "campaign", "paid ads", "adcreative", "outbound", "cold", "funnels", "landing", "leadpages", "clickfunnels", "gohighlevel"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "launch-campaigns",
      secondaryOutcomeSlugs: textIncludes(haystack, ["landing", "site", "website"]) ? ["build-software"] : [],
      subcategorySlugs: textIncludes(haystack, ["email"])
        ? ["email-marketing"]
        : textIncludes(haystack, ["outbound", "cold"])
          ? ["outbound-cold-email"]
          : textIncludes(haystack, ["funnel", "clickfunnels"])
            ? ["funnels-sequences"]
            : ["landing-pages"],
      confidence: "medium",
      reason: "The tool is tied to campaign execution, outbound, funnels, or landing page conversion.",
    });
  }

  if (textIncludes(haystack, ["chatbot", "voice agent", "voice ai", "conversational ai", "virtual agent", "copilot", "assistant", "agent", "knowledge base", "custom gpt"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "build-ai-agents",
      secondaryOutcomeSlugs: textIncludes(haystack, ["customer", "support", "helpdesk"]) ? ["support-customers"] : [],
      subcategorySlugs: textIncludes(haystack, ["voice"])
        ? ["build-voice-agents"]
        : textIncludes(haystack, ["knowledge", "rag"])
          ? ["rag-knowledge-bases"]
          : ["build-chatbots"],
      confidence: "medium",
      reason: "The tool creates AI assistants, copilots, chatbots, voice agents, or knowledge workers.",
    });
  }

  if (textIncludes(haystack, ["automation", "process automation", "scraping", "ocr", "data entry", "document processing", "bardeen", "browse ai"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "automate-workflows",
      secondaryOutcomeSlugs: textIncludes(haystack, ["scraping"]) ? ["analyze-data"] : [],
      subcategorySlugs: textIncludes(haystack, ["scraping"])
        ? ["web-scraping-data-entry"]
        : textIncludes(haystack, ["ocr", "document"])
          ? ["document-processing-ocr"]
          : ["connect-apps"],
      confidence: "medium",
      reason: "The tool connects systems or automates repeatable operational steps.",
    });
  }

  if (textIncludes(haystack, ["support", "helpdesk", "ticket", "customer service", "live chat", "nps", "feedback"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "support-customers",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["ticket", "helpdesk"])
        ? ["helpdesk-ticketing"]
        : textIncludes(haystack, ["feedback", "nps"])
          ? ["feedback-nps-voc"]
          : ["ai-chatbots-live-chat"],
      confidence: "medium",
      reason: "The tool helps answer, deflect, route, or measure customer support work.",
    });
  }

  if (textIncludes(haystack, ["video", "audio", "music", "podcast", "avatar", "voice", "caption", "transcribe", "dubbing"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "produce-video-audio",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["music", "sound"])
        ? ["music-sound-design"]
        : textIncludes(haystack, ["voice", "dubbing"])
          ? ["voice-generation-dubbing"]
          : textIncludes(haystack, ["caption", "transcribe"])
            ? ["transcribe-caption"]
            : textIncludes(haystack, ["avatar"])
              ? ["ai-avatars-spokespersons"]
              : ["generate-video"],
      confidence: "medium",
      reason: "The tool primarily creates or edits video, audio, captions, voice, or music.",
    });
  }

  if (textIncludes(haystack, ["image", "photo", "graphic", "design", "logo", "slides", "deck", "mockup", "illustration", "canva", "gamma"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "design-visuals",
      secondaryOutcomeSlugs: textIncludes(haystack, ["slides", "deck", "gamma"]) ? ["create-content"] : [],
      subcategorySlugs: textIncludes(haystack, ["slides", "deck", "gamma"])
        ? ["slides-decks"]
        : textIncludes(haystack, ["logo", "brand"])
          ? ["brand-logo-design"]
          : textIncludes(haystack, ["image generation", "generator"])
            ? ["generate-images"]
          : textIncludes(haystack, ["edit", "retouch", "photo"])
            ? ["edit-retouch-photos"]
            : ["generate-images"],
      confidence: "medium",
      reason: "The tool is primarily for visual asset creation, editing, branding, mockups, or decks.",
    });
  }

  if (textIncludes(haystack, ["code", "developer", "debug", "qa", "test", "site", "website", "app builder", "no-code", "replit", "devin", "hostinger", "wix"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "build-software",
      secondaryOutcomeSlugs: textIncludes(haystack, ["landing"]) ? ["launch-campaigns"] : [],
      subcategorySlugs: textIncludes(haystack, ["debug", "review"])
        ? ["debug-code-review"]
        : textIncludes(haystack, ["test", "qa"])
          ? ["test-qa-automation"]
          : textIncludes(haystack, ["no-code"])
            ? ["build-without-code"]
            : ["generate-full-apps-sites"],
      confidence: "medium",
      reason: "The tool supports shipping code, websites, apps, or no-code software experiences.",
    });
  }

  if (textIncludes(haystack, ["sales", "crm", "pipeline", "prospect", "lead", "quote", "proposal", "revenue", "forecast"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "sell-close-deals",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["crm", "pipeline"])
        ? ["crm-pipeline-management"]
        : textIncludes(haystack, ["proposal", "quote"])
          ? ["proposal-quoting"]
          : ["prospect-enrich-leads"],
      confidence: "medium",
      reason: "The tool is tied to prospecting, CRM, pipeline, proposals, or revenue work.",
    });
  }

  if (textIncludes(haystack, ["data", "analytics", "dashboard", "spreadsheet", "forecast", "pdf", "document q", "scraping"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "analyze-data",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["spreadsheet"])
        ? ["spreadsheet-ai"]
        : textIncludes(haystack, ["forecast", "prediction"])
          ? ["forecasting-prediction"]
          : textIncludes(haystack, ["pdf", "document"])
            ? ["document-q-a"]
            : ["dashboards-bi"],
      confidence: "medium",
      reason: "The tool turns data or documents into insight, dashboards, forecasts, or answers.",
    });
  }

  if (textIncludes(haystack, ["research", "learn", "study", "notes", "notebook", "course", "training", "summarize", "glasp", "perplexity"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "research-learn",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["notes", "notebook", "glasp"])
        ? ["note-taking-pkm"]
        : textIncludes(haystack, ["summarize"])
          ? ["summarize-papers-docs"]
          : ["deep-research"],
      confidence: "medium",
      reason: "The tool helps users research, summarize, study, train, or organize knowledge.",
    });
  }

  if (textIncludes(haystack, ["project", "task", "calendar", "meeting", "docs", "wiki", "okr", "productivity", "collaborate", "microsoft 365", "miro", "trello", "clickup"])) {
    return makeProposal(input, {
      primaryOutcomeSlug: "plan-collaborate",
      secondaryOutcomeSlugs: [],
      subcategorySlugs: textIncludes(haystack, ["meeting"])
        ? ["meetings-ai-notetakers"]
        : textIncludes(haystack, ["calendar", "time"])
          ? ["time-calendar-management"]
          : textIncludes(haystack, ["docs", "wiki"])
            ? ["docs-wikis"]
            : ["tasks-project-management"],
      confidence: "medium",
      reason: "The tool supports task, project, planning, meeting, docs, calendar, or collaboration workflows.",
    });
  }

  return makeProposal(input, {
    primaryOutcomeSlug: "create-content",
    secondaryOutcomeSlugs: [],
    subcategorySlugs: ["long-form-writing"],
    confidence: "low",
    reason: "Fallback classification; requires human review.",
  });
}

export function validateOutcomeProposal(proposal: OutcomeMigrationProposal): OutcomeMigrationValidation {
  const errors: string[] = [];

  if (!proposal.primaryOutcomeSlug) {
    errors.push("primaryOutcomeSlug is required");
  } else if (!OUTCOME_SLUGS.has(proposal.primaryOutcomeSlug)) {
    errors.push(`unknown primaryOutcomeSlug: ${proposal.primaryOutcomeSlug}`);
  }

  if (proposal.subcategorySlugs.length === 0) {
    errors.push("at least one subcategorySlug is required");
  }

  for (const slug of proposal.secondaryOutcomeSlugs) {
    if (!OUTCOME_SLUGS.has(slug)) errors.push(`unknown secondaryOutcomeSlug: ${slug}`);
  }

  for (const slug of proposal.subcategorySlugs) {
    if (!SUBCATEGORY_SLUGS.has(slug)) errors.push(`unknown subcategorySlug: ${slug}`);
  }

  return { valid: errors.length === 0, errors };
}
