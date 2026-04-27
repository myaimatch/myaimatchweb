import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/services/Reveal";
import TiltCard from "@/components/services/TiltCard";
import {
  Bot,
  FileCheck2,
  GraduationCap,
  Library,
  Settings2,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "AI Implementation & Systems Setup | myAImatch",
  },
  description:
    "Deploy AI systems, workflows, automations, internal copilots, and team adoption processes built around real business operations.",
  alternates: {
    canonical: "/ai-implementation",
  },
  openGraph: {
    title: "AI Implementation & Systems Setup | myAImatch",
    description:
      "Deploy AI systems, workflows, automations, internal copilots, and team adoption processes built around real business operations.",
    url: "https://myaimatch.ai/ai-implementation",
    type: "website",
  },
};

const calHref = process.env.NEXT_PUBLIC_CAL_IMPLEMENTATION_URL || "#book";

const deliverables = [
  {
    Icon: Workflow,
    eyebrow: "01",
    title: "AI Workflow Automation",
  },
  {
    Icon: Bot,
    eyebrow: "02",
    title: "Internal AI Copilots",
  },
  {
    Icon: Library,
    eyebrow: "03",
    title: "Prompt Libraries + SOP Systems",
  },
  {
    Icon: Settings2,
    eyebrow: "04",
    title: "Client Onboarding Systems",
  },
  {
    Icon: SlidersHorizontal,
    eyebrow: "05",
    title: "Sales Follow-Up Automation",
  },
  {
    Icon: Settings2,
    eyebrow: "06",
    title: "Reporting + Operations Systems",
  },
  {
    Icon: GraduationCap,
    eyebrow: "07",
    title: "Team Enablement + Training",
  },
  {
    Icon: FileCheck2,
    eyebrow: "08",
    title: "Documentation + Handoff",
  },
];

const processSteps = [
  {
    title: "Step 1 — Strategy & Qualification",
    body: "We review your roadmap and identify implementation priorities.",
  },
  {
    title: "Step 2 — Scope Definition",
    body: "We define systems, workflows, integrations, and delivery requirements.",
  },
  {
    title: "Step 3 — Custom Proposal",
    body: "You receive a tailored implementation proposal with scope, timeline, and execution plan.",
  },
  {
    title: "Step 4 — Build & Deployment",
    body: "We design, configure, test, and deploy your AI systems.",
  },
  {
    title: "Step 5 — Training + Optimization",
    body: "Your team receives onboarding, documentation, and optimization support.",
  },
];

const outcomePoints = [
  "Cleaner handoffs",
  "Faster execution cycles",
  "Higher team adoption",
  "Less manual operational drag",
];

const faqs = [
  {
    question: "Why is pricing custom?",
    answer:
      "Because every implementation depends on your workflows, team structure, integrations, operational complexity, and business goals. We scope the work around the system your business actually needs.",
  },
  {
    question: "Do I need the Strategy Roadmap first?",
    answer:
      "Usually, yes. Implementation works best when we first identify the highest-value workflow and define the right strategic priorities. This ensures we solve the right problem before building the solution.",
  },
  {
    question: "Can you work with our current tools?",
    answer:
      "Yes. We can work with your existing tools when they support the workflow, replace tools that create friction, or connect systems through automation and process design.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Timelines vary by scope. After the Strategy Roadmap, we define the systems, integrations, team needs, and delivery requirements before proposing a timeline.",
  },
  {
    question: "Do you train our team?",
    answer:
      "Yes. Adoption is critical. We include onboarding and enablement so implementation actually becomes part of the operating rhythm.",
  },
  {
    question: "What happens after implementation?",
    answer:
      "Many clients continue with our Fractional AI Lead service for ongoing optimization, strategic support, and system improvement.",
  },
];

export default function AIImplementationPage() {
  return (
    <div className="ai-implementation-page bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .ai-implementation-page {
          --impl-bg: #111111;
          --impl-primary: #8468EB;
          --impl-accent: #C4B5FD;
          --impl-purple-deep: #5B42C3;
          --impl-surface: rgba(255,255,255,0.04);
          --impl-surface-strong: rgba(255,255,255,0.07);
          --impl-border: rgba(255,255,255,0.08);
          --impl-border-strong: rgba(196,181,253,0.22);
          --impl-muted: rgba(255,255,255,0.62);
          --impl-dim: rgba(255,255,255,0.42);
          background:
            radial-gradient(ellipse 86% 48% at 50% 0%, rgba(132,104,235,0.18), transparent 72%),
            var(--impl-bg);
          color: #ffffff;
          overflow: hidden;
        }

        .impl-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .impl-label {
          margin-bottom: 14px;
          color: var(--impl-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .impl-section-title {
          color: #ffffff;
          font-size: clamp(34px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1;
        }

        .impl-section-body {
          margin-top: 18px;
          color: var(--impl-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .impl-cta-primary,
        .impl-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 750;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, border-color 180ms ease;
        }

        .impl-cta-primary {
          color: #ffffff;
          background: linear-gradient(135deg, var(--impl-primary), var(--impl-purple-deep));
          border: 1px solid rgba(196,181,253,0.26);
        }

        .impl-cta-secondary {
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .impl-cta-primary:hover,
        .impl-cta-secondary:hover {
          opacity: 0.94;
          transform: translateY(-2px);
          border-color: rgba(196,181,253,0.34);
        }

        .impl-cta-primary:active,
        .impl-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .impl-cta-primary:focus-visible,
        .impl-cta-secondary:focus-visible,
        .impl-faq summary:focus-visible {
          outline: 2px solid var(--impl-accent);
          outline-offset: 3px;
        }

        .impl-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--impl-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 56% at 50% 100%, rgba(132,104,235,0.16), transparent 70%),
            var(--impl-surface);
        }

        .impl-card::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -46px;
          width: 220px;
          height: 90px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(132,104,235,0.44), transparent 70%);
          filter: blur(10px);
          opacity: 0.22;
          pointer-events: none;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .impl-card:hover::after {
          opacity: 0.42;
          transform: translateX(-50%) scale(1.08);
        }

        .impl-hero {
          position: relative;
          min-height: calc(100vh - 64px);
          display: grid;
          align-items: center;
          padding: 96px 0 86px;
          isolation: isolate;
          background:
            linear-gradient(180deg, rgba(132,104,235,0.16), transparent 34%),
            radial-gradient(ellipse 78% 44% at 50% 14%, rgba(132,104,235,0.28), transparent 70%),
            #000000;
        }

        .impl-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 88px 88px;
          mask-image: radial-gradient(ellipse 74% 56% at 50% 18%, black, transparent 78%);
          pointer-events: none;
        }

        .impl-hero::after,
        .impl-beam-section::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 170px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.78), rgba(132,104,235,0.28), transparent);
          pointer-events: none;
        }

        .impl-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.96fr) minmax(380px, 0.84fr);
          gap: clamp(32px, 6vw, 72px);
          align-items: center;
        }

        .impl-hero-copy {
          position: relative;
          z-index: 2;
        }

        .impl-hero-title {
          max-width: 780px;
          color: #ffffff;
          font-size: clamp(48px, 8vw, 98px);
          font-weight: 850;
          letter-spacing: -0.055em;
          line-height: 0.92;
        }

        .impl-hero-title span {
          background: linear-gradient(135deg, #ffffff 8%, var(--impl-accent) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .impl-hero-body {
          margin-top: 26px;
          max-width: 680px;
          color: rgba(255,255,255,0.68);
          font-size: 17px;
          line-height: 1.78;
        }

        .impl-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .impl-proof-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .impl-proof-row span {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 999px;
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.62);
          padding: 0 13px;
          font-size: 12px;
          font-weight: 700;
        }

        .impl-dashboard {
          position: relative;
          min-height: 520px;
          padding: 22px;
          border: 1px solid rgba(196,181,253,0.18);
          border-radius: 28px;
          background:
            radial-gradient(ellipse 82% 58% at 50% 0%, rgba(132,104,235,0.24), transparent 72%),
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)),
            rgba(9,9,12,0.82);
          box-shadow:
            0 28px 90px rgba(0,0,0,0.52),
            0 0 34px rgba(132,104,235,0.12);
          backdrop-filter: blur(16px);
        }

        .impl-dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .impl-window-dots {
          display: flex;
          gap: 7px;
        }

        .impl-window-dots span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
        }

        .impl-status-pill {
          display: inline-flex;
          min-height: 28px;
          align-items: center;
          border: 1px solid rgba(196,181,253,0.22);
          border-radius: 999px;
          background: rgba(132,104,235,0.1);
          color: rgba(255,255,255,0.76);
          padding: 0 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .impl-system-map {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 20px;
        }

        .impl-system-node {
          position: relative;
          z-index: 1;
          min-height: 118px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background:
            radial-gradient(ellipse 80% 56% at 50% 100%, rgba(132,104,235,0.16), transparent 72%),
            rgba(255,255,255,0.035);
          padding: 16px;
        }

        .impl-system-node.is-core {
          grid-column: span 2;
          min-height: 150px;
          border-color: rgba(196,181,253,0.24);
          background:
            radial-gradient(ellipse 90% 70% at 50% 100%, rgba(132,104,235,0.26), transparent 72%),
            rgba(255,255,255,0.052);
        }

        .impl-system-node span,
        .impl-architecture span,
        .impl-roadmap span {
          display: block;
          color: rgba(196,181,253,0.82);
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .impl-system-node strong {
          display: block;
          margin-top: 18px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .impl-system-node p {
          margin-top: 8px;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          line-height: 1.55;
        }

        .impl-flow-lines {
          position: absolute;
          inset: 38px 40px;
          z-index: 0;
          border: 1px solid rgba(196,181,253,0.12);
          border-radius: 24px;
          pointer-events: none;
        }

        .impl-flow-lines::before,
        .impl-flow-lines::after {
          content: "";
          position: absolute;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.42), transparent);
        }

        .impl-flow-lines::before {
          top: 18px;
          height: 118px;
        }

        .impl-flow-lines::after {
          bottom: 18px;
          height: 118px;
          transform: translateX(-50%) rotate(180deg);
        }

        .impl-ops-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 16px;
        }

        .impl-ops-strip div {
          min-height: 74px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          padding: 12px;
        }

        .impl-ops-strip strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          letter-spacing: -0.02em;
        }

        .impl-ops-strip span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,0.42);
          font-size: 11px;
          line-height: 1.35;
        }

        .impl-split {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(360px, 1fr);
          gap: clamp(32px, 6vw, 72px);
          align-items: center;
          padding: 104px 0;
        }

        .impl-problem-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .impl-problem-list li {
          list-style: none;
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.72);
          padding: 14px 14px 14px 36px;
          font-size: 14px;
          line-height: 1.45;
        }

        .impl-problem-list li::before {
          content: "";
          position: absolute;
          left: 15px;
          top: 20px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--impl-primary);
          box-shadow: 0 0 16px rgba(132,104,235,0.56);
        }

        .impl-path-card {
          padding: 24px;
        }

        .impl-paths {
          display: grid;
          gap: 16px;
        }

        .impl-path {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          padding: 18px;
        }

        .impl-path.is-good {
          border-color: rgba(196,181,253,0.24);
          background:
            radial-gradient(ellipse 82% 70% at 50% 100%, rgba(132,104,235,0.18), transparent 72%),
            rgba(255,255,255,0.045);
        }

        .impl-path h3 {
          color: #ffffff;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .impl-path ol {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 16px;
          padding: 0;
        }

        .impl-path li {
          list-style: none;
          position: relative;
          min-height: 76px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(0,0,0,0.24);
          color: rgba(255,255,255,0.72);
          padding: 12px;
          text-align: center;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.25;
        }

        .impl-path li:not(:last-child)::after {
          content: "";
          position: absolute;
          right: -7px;
          top: 50%;
          z-index: 3;
          width: 8px;
          height: 1px;
          background: rgba(196,181,253,0.44);
        }

        .impl-definition {
          padding: 82px 0;
          background:
            radial-gradient(ellipse 82% 60% at 50% 0%, rgba(132,104,235,0.14), transparent 74%),
            rgba(255,255,255,0.018);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .impl-definition-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.74fr);
          gap: clamp(32px, 6vw, 68px);
          align-items: start;
        }

        .impl-category-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .impl-category-grid span {
          display: flex;
          min-height: 72px;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.76);
          padding: 0 16px;
          font-size: 14px;
          font-weight: 750;
        }

        .impl-build {
          padding: 104px 0 92px;
        }

        .impl-build-head {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(360px, 0.72fr);
          gap: clamp(28px, 5vw, 64px);
          align-items: end;
          margin-bottom: 42px;
        }

        .impl-architecture {
          min-height: 230px;
          padding: 20px;
        }

        .impl-architecture-grid {
          display: grid;
          grid-template-columns: 0.8fr 1fr 0.8fr;
          gap: 10px;
          align-items: center;
          margin-top: 18px;
        }

        .impl-architecture-col {
          display: grid;
          gap: 10px;
        }

        .impl-architecture-box {
          min-height: 54px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.68);
          padding: 13px;
          font-size: 12px;
          font-weight: 750;
        }

        .impl-architecture-core {
          min-height: 152px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(196,181,253,0.28);
          border-radius: 16px;
          background:
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(132,104,235,0.28), transparent 72%),
            rgba(255,255,255,0.05);
          color: #ffffff;
          padding: 18px;
          text-align: center;
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -0.02em;
        }

        .impl-deliverables-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .impl-deliverable {
          min-height: 176px;
          padding: 24px;
        }

        .impl-deliverable .eyebrow {
          color: rgba(196,181,253,0.84);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .impl-deliverable h3 {
          position: relative;
          z-index: 1;
          margin-top: 26px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.18;
        }

        .impl-deliverable p {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.68;
        }

        .impl-scope-card {
          max-width: 760px;
          margin: 46px auto 0;
          padding: clamp(30px, 5vw, 48px);
          text-align: center;
          border-color: rgba(132,104,235,0.32);
          background:
            radial-gradient(ellipse 100% 80% at 50% 0%, rgba(132,104,235,0.2), transparent 68%),
            rgba(255,255,255,0.04);
        }

        .impl-process-list {
          display: grid;
          gap: 14px;
          margin-top: 44px;
        }

        .impl-process-step {
          display: grid;
          grid-template-columns: minmax(220px, 0.44fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          padding: 22px 24px;
        }

        .impl-process-step h3 {
          margin: 0;
          color: #ffffff;
          font-size: 17px;
          font-weight: 850;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .impl-process-step p {
          margin: 0;
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          line-height: 1.65;
        }

        .impl-pricing {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(360px, 0.72fr);
          gap: clamp(34px, 6vw, 72px);
          align-items: center;
          padding: 96px 0;
        }

        .impl-price-card {
          padding: 32px;
        }

        .impl-price-card .price-label {
          color: rgba(196,181,253,0.82);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .impl-price-card strong {
          display: block;
          margin-top: 18px;
          color: #ffffff;
          font-size: clamp(44px, 7vw, 78px);
          font-weight: 850;
          letter-spacing: -0.055em;
          line-height: 0.95;
        }

        .impl-price-card p {
          margin-top: 20px;
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.7;
        }

        .impl-authority {
          padding: 96px 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.14), transparent 72%),
            rgba(255,255,255,0.018);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .impl-authority-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.84fr) minmax(360px, 0.78fr);
          gap: clamp(34px, 6vw, 72px);
          align-items: center;
        }

        .impl-authority-points {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .impl-authority-points div {
          min-height: 118px;
          display: flex;
          align-items: flex-end;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 80% 54% at 50% 100%, rgba(132,104,235,0.16), transparent 72%),
            rgba(255,255,255,0.035);
          color: #ffffff;
          padding: 18px;
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -0.02em;
        }

        .impl-faq-section {
          padding: 96px 0;
        }

        .impl-faq-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.64fr) minmax(420px, 1fr);
          gap: clamp(32px, 6vw, 74px);
          align-items: start;
        }

        .impl-faq-list {
          display: grid;
          gap: 12px;
        }

        .impl-faq {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          overflow: hidden;
        }

        .impl-faq summary {
          cursor: pointer;
          list-style: none;
          color: #ffffff;
          padding: 21px 24px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .impl-faq summary::-webkit-details-marker {
          display: none;
        }

        .impl-faq summary::after {
          content: "+";
          float: right;
          color: var(--impl-accent);
          font-size: 18px;
          line-height: 1;
        }

        .impl-faq[open] summary::after {
          content: "-";
        }

        .impl-faq p {
          margin: 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.62);
          padding: 0 24px 22px;
          font-size: 15px;
          line-height: 1.7;
        }

        .impl-final {
          position: relative;
          padding: 112px 0 120px;
          text-align: center;
          background:
            radial-gradient(ellipse 80% 58% at 50% 0%, rgba(132,104,235,0.22), transparent 72%),
            #000000;
        }

        .impl-final h2 {
          margin: 0 auto;
          max-width: 940px;
          color: #ffffff;
          font-size: clamp(44px, 8vw, 96px);
          font-weight: 850;
          letter-spacing: -0.055em;
          line-height: 0.94;
        }

        .impl-final p {
          margin: 26px auto 0;
          max-width: 680px;
          color: rgba(255,255,255,0.66);
          font-size: 17px;
          line-height: 1.78;
        }

        .impl-final .impl-cta-primary {
          margin-top: 34px;
        }

        .impl-problem-section {
          position: relative;
          padding: 100px 0 110px;
          background:
            radial-gradient(ellipse 72% 54% at 50% 58%, rgba(132,104,235,0.08), transparent 74%),
            #111111;
        }

        .impl-problem-content {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .impl-problem-intro {
          margin: 22px auto 0;
          max-width: 650px;
          color: rgba(255,255,255,0.6);
          font-size: 17px;
          line-height: 1.75;
        }

        .impl-path-diagram {
          display: grid;
          gap: 14px;
          margin-top: 54px;
        }

        .impl-path-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          min-height: 66px;
          border-radius: 18px;
          padding: 16px 18px;
        }

        .impl-path-row--bad {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          opacity: 0.8;
        }

        .impl-path-row--good {
          border: 1px solid rgba(132,104,235,0.34);
          background:
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(132,104,235,0.17), transparent 82%),
            rgba(132,104,235,0.055);
          box-shadow: 0 0 42px rgba(132,104,235,0.1);
        }

        .impl-path-badge,
        .impl-path-step,
        .impl-path-outcome {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          border-radius: 999px;
          padding: 0 13px;
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
        }

        .impl-path-badge {
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .impl-path-row--bad .impl-path-badge {
          color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .impl-path-row--good .impl-path-badge {
          color: #C4B5FD;
          background: rgba(132,104,235,0.18);
          border: 1px solid rgba(132,104,235,0.34);
        }

        .impl-path-steps {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .impl-path-step {
          border-radius: 8px;
          font-weight: 750;
        }

        .impl-path-row--bad .impl-path-step {
          color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: line-through;
          text-decoration-color: rgba(255,255,255,0.2);
        }

        .impl-path-row--good .impl-path-step {
          color: rgba(255,255,255,0.88);
          background: rgba(132,104,235,0.15);
          border: 1px solid rgba(132,104,235,0.25);
        }

        .impl-path-arrow {
          color: rgba(255,255,255,0.18);
          font-size: 13px;
          font-weight: 900;
        }

        .impl-path-row--good .impl-path-arrow {
          color: rgba(196,181,253,0.58);
        }

        .impl-path-outcome {
          margin-left: auto;
          border-radius: 8px;
        }

        .impl-path-row--bad .impl-path-outcome {
          color: rgba(248,113,113,0.82);
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
        }

        .impl-path-row--good .impl-path-outcome {
          color: #86efac;
          background: rgba(134,239,172,0.08);
          border: 1px solid rgba(134,239,172,0.18);
        }

        .impl-deliverable-icon {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(132,104,235,0.24);
          border-radius: 12px;
          background: rgba(132,104,235,0.14);
          color: #C4B5FD;
        }

        .impl-deliverable-icon svg {
          width: 20px;
          height: 20px;
        }

        .impl-deliverable .eyebrow {
          margin-top: 20px;
        }

        .impl-pricing.impl-pricing-centered {
          display: block;
          padding: 100px 0 110px;
          text-align: center;
        }

        .impl-pricing-centered .impl-section-body {
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        .impl-pricing-centered .impl-price-card {
          max-width: 680px;
          margin: 48px auto 0;
          padding: clamp(34px, 6vw, 56px);
          border-color: rgba(132,104,235,0.32);
          background:
            radial-gradient(ellipse 100% 80% at 50% 0%, rgba(132,104,235,0.22), transparent 68%),
            rgba(255,255,255,0.04);
          box-shadow: 0 0 72px rgba(132,104,235,0.1), 0 20px 60px rgba(0,0,0,0.3);
        }

        .impl-price-card .impl-price-note {
          margin-top: 14px;
          color: rgba(255,255,255,0.46);
          font-size: 13px;
          line-height: 1.6;
        }

        .impl-price-card .impl-cta-primary {
          margin-top: 28px;
        }

        @media (max-width: 1060px) {
          .impl-deliverables-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 980px) {
          .impl-hero {
            min-height: auto;
            padding: 82px 0 72px;
          }

          .impl-hero-grid,
          .impl-split,
          .impl-definition-grid,
          .impl-build-head,
          .impl-process-step,
          .impl-pricing,
          .impl-authority-grid,
          .impl-faq-grid {
            grid-template-columns: 1fr;
          }

          .impl-dashboard {
            min-height: auto;
          }

          .impl-path ol,
          .impl-authority-points {
            grid-template-columns: 1fr;
          }

          .impl-path li:not(:last-child)::after {
            display: none;
          }

          .impl-path-outcome {
            margin-left: 0;
          }
        }

        @media (max-width: 640px) {
          .impl-shell {
            width: min(100% - 24px, 1180px);
          }

          .impl-hero-title,
          .impl-final h2 {
            font-size: clamp(40px, 13vw, 64px);
            line-height: 0.98;
          }

          .impl-hero-actions,
          .impl-final .impl-cta-primary,
          .impl-cta-primary,
          .impl-cta-secondary {
            width: 100%;
          }

          .impl-system-map,
          .impl-ops-strip,
          .impl-problem-list,
          .impl-category-grid,
          .impl-architecture-grid,
          .impl-deliverables-grid {
            grid-template-columns: 1fr;
          }

          .impl-system-node.is-core {
            grid-column: auto;
          }

          .impl-flow-lines {
            display: none;
          }

          .impl-split,
          .impl-problem-section,
          .impl-definition,
          .impl-build,
          .impl-pricing,
          .impl-authority,
          .impl-faq-section,
          .impl-final {
            padding-top: 72px;
            padding-bottom: 72px;
          }

          .impl-path-row {
            align-items: flex-start;
          }

          .impl-path-steps {
            width: 100%;
          }
        }
      ` }} />

      <section className="impl-hero">
        <div className="impl-shell impl-hero-grid">
          <div className="impl-hero-copy">
            <p className="impl-label">AI Implementation & Systems Setup</p>
            <h1 className="impl-hero-title">
              We Build the AI Systems That Actually Improve <span>Operations</span>
            </h1>
            <p className="impl-hero-body">
              After identifying your highest-priority workflow, we design and implement the AI systems, automations, and operational infrastructure required to create real business results.
              <br /><br />
              No random tools. No disconnected automations. Only systems built around measurable ROI.
            </p>
            <div className="impl-hero-actions">
              <Link className="impl-cta-primary" href={calHref}>
                Request Your Custom Implementation Plan
              </Link>
              <Link className="impl-cta-secondary" href="#what-we-build">
                See What We Build
              </Link>
            </div>
            <div className="impl-proof-row" aria-label="Implementation focus areas">
              <span>Operational systems</span>
              <span>Team adoption</span>
              <span>Measurable ROI</span>
            </div>
          </div>

          <OperationsDashboard />
        </div>
      </section>

      <section className="impl-problem-section" aria-labelledby="implementation-breaks">
        <div className="impl-shell impl-problem-content">
          <p className="impl-label">Strategy to implementation</p>
          <h2 id="implementation-breaks" className="impl-section-title">Built Around One Strategic Priority — Designed for Long-Term Scale</h2>
          <p className="impl-problem-intro">
            Every implementation starts with a clear operational priority.
            <br /><br />
            But solving one workflow properly usually requires more than one tool.
            <br /><br />
            It requires system design: automations, internal processes, documentation, team adoption, reporting structure, and operational alignment.
            <br /><br />
            That&apos;s what we build.
            <br /><br />
            We start with the right problem first — then build the systems required to solve it properly.
          </p>
          <div className="impl-path-diagram" aria-label="Implementation path comparison">
            <div className="impl-path-row impl-path-row--bad">
              <span className="impl-path-badge">Without systems</span>
              <div className="impl-path-steps">
                <span className="impl-path-step">Buy Tools</span>
                <span className="impl-path-arrow">→</span>
                <span className="impl-path-step">Confusion</span>
                <span className="impl-path-arrow">→</span>
                <span className="impl-path-step">Poor Adoption</span>
              </div>
              <span className="impl-path-outcome">Failure</span>
            </div>
            <div className="impl-path-row impl-path-row--good">
              <span className="impl-path-badge">With myAImatch</span>
              <div className="impl-path-steps">
                <span className="impl-path-step">Strategy</span>
                <span className="impl-path-arrow">→</span>
                <span className="impl-path-step">Systems</span>
                <span className="impl-path-arrow">→</span>
                <span className="impl-path-step">Adoption</span>
              </div>
              <span className="impl-path-outcome">ROI</span>
            </div>
          </div>
        </div>
      </section>

      <section id="what-we-build" className="impl-shell impl-build" aria-labelledby="what-we-build-title">
        <div className="impl-build-head">
          <div>
            <p className="impl-label">What we build</p>
            <h2 id="what-we-build-title" className="impl-section-title">What We Build</h2>
            <p className="impl-section-body">
              Practical implementation work designed around the operational systems your team needs to run the workflow properly.
            </p>
          </div>
          <Reveal>
            <div className="impl-card impl-architecture" aria-label="Implementation architecture visual">
              <span>Implementation roadmap</span>
              <div className="impl-architecture-grid">
                <div className="impl-architecture-col">
                  <div className="impl-architecture-box">Inputs</div>
                  <div className="impl-architecture-box">Workflows</div>
                </div>
                <div className="impl-architecture-core">Operating AI System</div>
                <div className="impl-architecture-col">
                  <div className="impl-architecture-box">Adoption</div>
                  <div className="impl-architecture-box">ROI</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="impl-deliverables-grid">
          {deliverables.map((item, index) => (
            <Reveal key={item.title} delay={80 + index * 55}>
              <TiltCard className="impl-card impl-deliverable" maxTilt={4}>
                <div className="impl-deliverable-icon" aria-hidden>
                  <item.Icon />
                </div>
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="impl-definition" aria-labelledby="not-tool-setup">
        <div className="impl-shell impl-definition-grid">
          <div>
            <p className="impl-label">Implementation depth</p>
            <h2 id="not-tool-setup" className="impl-section-title">This Is Not Tool Setup</h2>
            <p className="impl-section-body">
              We do not sell “AI tool setup.”
              <br /><br />
              We design operational systems that improve how your business actually works.
              <br /><br />
              Tools are only part of the solution.
            </p>
          </div>
          <div className="impl-card impl-scope-card">
            <p className="impl-section-body" style={{ marginTop: 0 }}>
              The real value comes from workflow design, implementation logic, team adoption, and long-term operational efficiency.
              <br /><br />
              That is what creates ROI.
            </p>
          </div>
        </div>
      </section>

      <section className="impl-shell impl-pricing impl-pricing-centered" aria-labelledby="implementation-investment">
        <div>
          <p className="impl-label">Custom implementation</p>
          <h2 id="implementation-investment" className="impl-section-title">Custom Scope. Custom Proposal.</h2>
          <p className="impl-section-body">
            Every implementation is different.
            <br /><br />
            The right solution depends on your workflows, team structure, operational complexity, integrations, and business goals.
            <br /><br />
            After your Strategy Roadmap, we define priorities, scope, and implementation requirements — then provide a custom proposal built around your specific needs.
            <br /><br />
            No generic packages. No fixed templates. Only strategic implementation.
          </p>
        </div>
        <Reveal>
          <TiltCard className="impl-card impl-price-card" maxTilt={3}>
            <p className="price-label">Custom Implementation Proposal</p>
            <Link className="impl-cta-primary" href={calHref}>
              Request Your Custom Implementation Plan
            </Link>
          </TiltCard>
        </Reveal>
      </section>

      <section className="impl-shell impl-build" aria-labelledby="implementation-process">
        <div className="mx-auto max-w-3xl text-center">
          <p className="impl-label">Process</p>
          <h2 id="implementation-process" className="impl-section-title">Our Implementation Process</h2>
        </div>
        <div className="impl-process-list">
          {processSteps.map((step) => (
            <Reveal key={step.title}>
              <div className="impl-process-step">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="impl-authority" aria-labelledby="operational-roi">
        <div className="impl-shell impl-authority-grid">
          <div>
            <p className="impl-label">Operational proof</p>
            <h2 id="operational-roi" className="impl-section-title">Built Around Real Operational ROI</h2>
            <p className="impl-section-body">
              Implementation is judged by operational movement, not tool count.
            </p>
            <p className="impl-section-body">
              The work is designed to reduce friction, improve adoption, and make the target workflow run better in the real business.
            </p>
          </div>
          <div className="impl-authority-points" aria-label="Operational implementation outcomes">
            {outcomePoints.map((point) => (
              <div key={point}>{point}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="impl-shell impl-faq-section" aria-labelledby="implementation-faq">
        <div className="impl-faq-grid">
          <div>
            <p className="impl-label">FAQ</p>
            <h2 id="implementation-faq" className="impl-section-title">Questions before implementation.</h2>
            <p className="impl-section-body">
              The goal is not to move fast into the wrong build. It is to scope the right system, deploy it cleanly, and make sure the team can use it.
            </p>
          </div>
          <div className="impl-faq-list">
            {faqs.map((faq) => (
              <details className="impl-faq" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="impl-final impl-beam-section" aria-labelledby="implementation-final">
        <div className="impl-shell">
          <h2 id="implementation-final">Build the Operational AI System Your Workflow Actually Needs.</h2>
          <p>
            Once the right priority is clear, we scope the systems, automations, integrations, and enablement required to implement it properly.
          </p>
          <Link className="impl-cta-primary" href={calHref}>
            Request Your Custom Implementation Plan
          </Link>
        </div>
      </section>
    </div>
  );
}

function OperationsDashboard() {
  return (
    <Reveal>
      <div className="impl-dashboard" aria-label="Operations dashboard visual">
        <div className="impl-dashboard-top">
          <div className="impl-window-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="impl-status-pill">Deployment Ready</div>
        </div>
        <div className="impl-system-map">
          <div className="impl-flow-lines" aria-hidden />
          <div className="impl-system-node">
            <span>Operations</span>
            <strong>Workflow inputs</strong>
            <p>Real processes, handoffs, owners, and decision points.</p>
          </div>
          <div className="impl-system-node">
            <span>Team</span>
            <strong>Adoption layer</strong>
            <p>Training, permissions, SOPs, and operating rhythm.</p>
          </div>
          <div className="impl-system-node is-core">
            <span>AI systems layer</span>
            <strong>Copilots, automations, prompts, and integrations</strong>
            <p>Connected around the work that actually moves the business.</p>
          </div>
          <div className="impl-system-node">
            <span>Quality</span>
            <strong>QA loops</strong>
            <p>Testing, feedback, optimization, and owner handoff.</p>
          </div>
          <div className="impl-system-node">
            <span>Business</span>
            <strong>ROI signals</strong>
            <p>Efficiency, cycle time, adoption, and operating leverage.</p>
          </div>
        </div>
        <div className="impl-ops-strip" aria-hidden>
          <div>
            <strong>01</strong>
            <span>Scope the workflows</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Deploy the systems</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Enable the team</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
