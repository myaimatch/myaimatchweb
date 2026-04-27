import Link from "next/link";
import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import TiltCard from "@/components/services/TiltCard";
import Reveal from "@/components/services/Reveal";
import CountUp from "@/components/services/CountUp";
import FaqAccordion from "@/components/services/FaqAccordion";
import {
  Phone,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  Users,
  Target,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fractional AI Advisor | Executive AI Leadership | myAImatch",
  description:
    "Executive-level AI leadership without the full-time hire. myAImatch provides ongoing strategy, workflow optimization, leadership alignment, and AI investment guidance — starting at $3,000/mo.",
  openGraph: {
    title: "Fractional AI Advisor | Executive AI Leadership | myAImatch",
    description:
      "Executive-level AI leadership without the full-time hire. myAImatch provides ongoing strategy, workflow optimization, leadership alignment, and AI investment guidance — starting at $3,000/mo.",
    url: "https://myaimatch.ai/fractional-ai-advisor",
    type: "website",
  },
};

const bookingHref = process.env.NEXT_PUBLIC_CAL_COACHING_URL || "#pricing";

const deliverables = [
  {
    icon: Phone,
    title: "Monthly Strategic Advisory Sessions",
    body: "Dedicated sessions to review performance, set direction, and align leadership on AI priorities.",
  },
  {
    icon: RefreshCw,
    title: "Ongoing Workflow Optimization",
    body: "Continuous review and improvement of AI-enabled processes across your operations.",
  },
  {
    icon: Lightbulb,
    title: "New Opportunity Identification",
    body: "We surface emerging AI opportunities specific to your business before your competitors do.",
  },
  {
    icon: ShieldCheck,
    title: "Vendor + Tool Evaluation",
    body: "Unbiased evaluation of AI tools, platforms, and vendors — so you only invest in what works.",
  },
  {
    icon: Users,
    title: "Team Support + Leadership Guidance",
    body: "We work alongside your leadership team to build internal AI confidence and adoption.",
  },
  {
    icon: Target,
    title: "AI Investment Prioritization",
    body: "Clear guidance on where to invest, what to cut, and what ROI to expect from AI spend.",
  },
  {
    icon: Zap,
    title: "Priority Strategic Support",
    body: "Urgent questions and strategic decisions handled with executive-level speed and clarity.",
  },
];

const faqItems = [
  {
    question: "Is this only for large companies?",
    answer:
      "No. Fractional AI Advisory is designed for growth-stage companies, mid-market businesses, and leadership teams that need strategic AI guidance without the overhead of a full-time executive. If you have an operational AI footprint and want to grow it intelligently, this is for you.",
  },
  {
    question: "Do we need implementation first?",
    answer:
      "Not necessarily. Some clients come to us after implementing AI tools and want to optimize what they have. Others start with Advisory to inform their implementation decisions. We assess your current state in the first session and build the engagement around what you actually need.",
  },
  {
    question: "How often do we meet?",
    answer:
      "Growth Advisory includes monthly strategic sessions plus async support between sessions. Strategic Partner includes higher-frequency touchpoints, leadership check-ins, and deeper operational involvement. Both tiers include written summaries and action plans after every session.",
  },
  {
    question: "Can you work with our leadership team directly?",
    answer:
      "Yes. That is the model. We work directly with founders, CEOs, COOs, and department heads — not just IT or operations. AI decisions at the leadership level require strategic counsel, not technical support tickets.",
  },
  {
    question: "Is this consulting or coaching?",
    answer:
      "Neither. This is executive AI advisory — a strategic partnership. We don't give you homework and check in monthly. We work alongside your leadership to make better AI decisions, solve real operational challenges, and build organizational AI capability over time.",
  },
];

export default function FractionalAiAdvisorPage() {
  return (
    <div className="advisor-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .advisor-page {
          --advisor-primary: #8468EB;
          --advisor-accent: #C4B5FD;
          --advisor-muted: rgba(255,255,255,0.62);
          min-height: 100vh;
          overflow: hidden;
          background: #111111;
        }

        /* ── Shell ────────────────────────────────────────────── */
        .advisor-shell {
          width: min(1080px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* ── Section shared ───────────────────────────────────── */
        .advisor-section {
          padding: 96px 0;
          position: relative;
        }

        .advisor-section + .advisor-section {
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .advisor-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8468EB;
          margin-bottom: 20px;
        }

        .advisor-h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 20px;
        }

        .advisor-body {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
        }

        /* ── Section 2 — Problem ──────────────────────────────── */
        .problem-section {
          background:
            radial-gradient(ellipse 72% 56% at 50% 0%, rgba(132,104,235,0.12), transparent 72%),
            #111111;
        }

        .problem-section .advisor-h2 {
          max-width: 680px;
        }

        .problem-section .advisor-body {
          max-width: 620px;
          margin-bottom: 40px;
        }

        .problem-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 52px;
        }

        .problem-tag {
          padding: 7px 16px;
          border: 1px solid rgba(132,104,235,0.24);
          border-radius: 999px;
          background: rgba(132,104,235,0.08);
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .path-diagram {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 780px;
        }

        .path-row {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
        }

        .path-row__label {
          padding: 14px 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          min-width: 72px;
          text-align: center;
        }

        .path-row--bad .path-row__label {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.36);
        }

        .path-row--good .path-row__label {
          background: rgba(132,104,235,0.18);
          color: #C4B5FD;
        }

        .path-row__steps {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 0 16px;
          gap: 0;
          overflow-x: auto;
        }

        .path-step {
          display: flex;
          align-items: center;
          gap: 0;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 500;
          padding: 14px 4px;
        }

        .path-step__text {
          padding: 0 12px;
        }

        .path-row--bad .path-step__text {
          color: rgba(255,255,255,0.48);
        }

        .path-row--good .path-step__text {
          color: rgba(255,255,255,0.88);
        }

        .path-step__arrow {
          color: rgba(255,255,255,0.18);
          font-size: 16px;
          margin: 0 2px;
        }

        .path-row--good .path-step__arrow {
          color: rgba(132,104,235,0.6);
        }

        .path-step:last-child .path-step__arrow {
          display: none;
        }

        /* ── Section 3 — What Is This ─────────────────────────── */
        .what-is-body {
          max-width: 640px;
          margin-bottom: 40px;
        }

        .focus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
          max-width: 780px;
        }

        .focus-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          background: rgba(255,255,255,0.025);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
          line-height: 1.5;
        }

        .focus-item__dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #8468EB;
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* ── Section 4 — What's Included ─────────────────────── */
        .included-section {
          background:
            radial-gradient(ellipse 64% 48% at 50% 0%, rgba(132,104,235,0.1), transparent 70%),
            #111111;
        }

        .deliverables-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 52px;
        }

        .deliverables-grid > :last-child:nth-child(3n + 1) {
          grid-column: 1 / -1;
          max-width: 340px;
          margin: 0 auto;
        }

        @media (max-width: 800px) {
          .deliverables-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .deliverables-grid > :last-child:nth-child(3n + 1) {
            grid-column: auto;
            max-width: none;
            margin: 0;
          }
        }

        @media (max-width: 560px) {
          .deliverables-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── TiltCard inner layout ────────────────────────────── */
        .advisor-tilt-card {
          height: 100%;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          background: rgba(255,255,255,0.025);
          transition: border-color 240ms ease, box-shadow 240ms ease;
        }
        .advisor-tilt-card:hover {
          border-color: rgba(132,104,235,0.24);
          box-shadow: 0 0 28px rgba(132,104,235,0.12);
        }
        .advisor-card-inner {
          padding: 28px 24px;
        }
        .advisor-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(132,104,235,0.14);
          border: 1px solid rgba(132,104,235,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C4B5FD;
          margin-bottom: 18px;
        }
        .advisor-card-title {
          font-size: 14px;
          font-weight: 650;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .advisor-card-body {
          font-size: 13.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.52);
          margin: 0;
        }

        /* ── Section 5 — Who This Is For ─────────────────────── */
        .who-for-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 44px;
          max-width: 680px;
        }

        .who-for-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid #8468EB;
          border-radius: 12px;
          background: rgba(255,255,255,0.025);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
          line-height: 1.55;
        }

        .who-for-item__check {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: rgba(132,104,235,0.18);
          border: 1px solid rgba(132,104,235,0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .who-for-item__check svg {
          width: 11px;
          height: 11px;
          stroke: #C4B5FD;
          stroke-width: 2.5;
          fill: none;
        }

        /* ── Section 6 — Why Fractional Works ────────────────── */
        .why-fractional-section {
          background:
            radial-gradient(ellipse 60% 44% at 50% 100%, rgba(132,104,235,0.09), transparent 72%),
            #111111;
        }

        .why-fractional-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
          margin-top: 52px;
        }

        @media (max-width: 800px) {
          .why-fractional-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .why-fractional-copy .advisor-body {
          margin-bottom: 24px;
        }

        .why-fractional-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .why-fractional-bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.68);
          line-height: 1.6;
        }

        .why-fractional-bullet::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #8468EB;
          flex-shrink: 0;
          margin-top: 8px;
        }

        .comparison-table {
          border: 1px solid rgba(132,104,235,0.2);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
        }

        .comparison-table__head {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          background: rgba(132,104,235,0.12);
          border-bottom: 1px solid rgba(132,104,235,0.16);
        }

        .comparison-table__head-cell {
          padding: 14px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .comparison-table__head-cell.is-highlight {
          color: #C4B5FD;
        }

        .comparison-table__row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .comparison-table__row:last-child {
          border-bottom: none;
        }

        .comparison-table__cell {
          padding: 14px 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.56);
          line-height: 1.5;
        }

        .comparison-table__cell.is-label {
          font-weight: 600;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
        }

        .comparison-table__cell.is-highlight {
          color: rgba(255,255,255,0.88);
          font-weight: 600;
        }

        /* ── Section 7 — Pricing ──────────────────────────────── */
        .pricing-section {
          text-align: center;
        }

        .pricing-section .advisor-h2 {
          text-align: center;
        }

        .pricing-intro {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.56);
          max-width: 520px;
          margin: 0 auto 52px;
        }

        .pricing-tier-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 820px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .pricing-tier-grid {
            grid-template-columns: 1fr;
          }
        }

        .tier-card {
          position: relative;
          padding: 36px 32px 32px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          text-align: left;
          transition: border-color 240ms ease, box-shadow 240ms ease;
        }

        .tier-card:hover {
          border-color: rgba(132,104,235,0.28);
          box-shadow: 0 0 32px rgba(132,104,235,0.12);
        }

        .tier-card.featured {
          border-color: rgba(132,104,235,0.36);
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.14), transparent 70%),
            rgba(132,104,235,0.06);
          box-shadow: 0 0 48px rgba(132,104,235,0.18);
        }

        .tier-card.featured:hover {
          border-color: rgba(196,181,253,0.5);
          box-shadow: 0 0 56px rgba(132,104,235,0.28);
        }

        .tier-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 14px;
          border: 1px solid rgba(196,181,253,0.28);
          border-radius: 999px;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .tier-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }

        .tier-price {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 6px;
        }

        .tier-price span {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255,255,255,0.48);
          letter-spacing: 0;
        }

        .tier-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.52);
          line-height: 1.65;
          margin: 16px 0 28px;
        }

        .tier-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 50px;
          padding: 0 24px;
          border: 1px solid rgba(132,104,235,0.36);
          border-radius: 999px;
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 180ms ease;
        }

        .tier-cta:hover {
          background: rgba(132,104,235,0.16);
          border-color: rgba(132,104,235,0.6);
          box-shadow: 0 0 24px rgba(132,104,235,0.2);
          transform: translateY(-1px);
        }

        .tier-card.featured .tier-cta {
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          border-color: rgba(196,181,253,0.2);
          box-shadow: 0 10px 28px rgba(91,66,195,0.32);
        }

        .tier-card.featured .tier-cta:hover {
          box-shadow: 0 14px 36px rgba(91,66,195,0.44);
          transform: translateY(-2px);
        }

        /* ── Section 8 — Why myAImatch ────────────────────────── */
        .authority-section {
          background:
            radial-gradient(ellipse 60% 44% at 50% 0%, rgba(132,104,235,0.12), transparent 72%),
            #111111;
        }

        .authority-body {
          max-width: 640px;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,0.6);
          margin-bottom: 52px;
        }

        .authority-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          max-width: 900px;
        }

        @media (max-width: 700px) {
          .authority-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .authority-metric {
          padding: 32px 24px;
          background: rgba(255,255,255,0.025);
          text-align: center;
        }

        .authority-metric__number {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 8px;
        }

        .authority-metric__number em {
          font-style: normal;
          color: #8468EB;
        }

        .authority-metric__label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.44);
          line-height: 1.5;
        }

        /* ── Section 9 — FAQ ──────────────────────────────────── */
        .faq-section {
          max-width: 760px;
        }

        /* ── Section 10 — Final CTA ───────────────────────────── */
        .final-cta-section {
          position: relative;
          isolation: isolate;
          text-align: center;
          padding: 120px 0 96px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.2), transparent 72%),
            #111111;
        }

        .final-cta-section::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 220px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.7), rgba(132,104,235,0.24), transparent);
          box-shadow: 0 0 24px rgba(132,104,235,0.48);
          pointer-events: none;
        }

        .final-cta-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8468EB;
          margin-bottom: 20px;
        }

        .final-cta-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #ffffff;
          max-width: 640px;
          margin: 0 auto 20px;
        }

        .final-cta-body {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.56);
          max-width: 520px;
          margin: 0 auto 44px;
        }

        .final-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          padding: 0 40px;
          border: 1px solid rgba(196,181,253,0.2);
          border-radius: 999px;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow:
            0 12px 32px rgba(91,66,195,0.36),
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 0 36px rgba(132,104,235,0.2);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .final-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 42px rgba(91,66,195,0.48),
            0 0 0 1px rgba(255,255,255,0.12) inset,
            0 0 48px rgba(132,104,235,0.32);
        }
      ` }} />

      {/* ── Section 1 — Hero ─────────────────────────────────────── */}
      <ServiceHero
        variant="lead"
        label="Fractional AI Advisor"
        title="Executive-Level AI Leadership"
        highlightedTitle="Without Hiring a Full-Time AI Executive."
        body="AI is not a one-time project. It requires continuous optimization, strategic decisions, leadership alignment, and ongoing operational improvement. We help your business stay ahead — identifying opportunities, improving adoption, optimizing systems, and guiding strategic AI decisions across your organization. Without the cost of a full-time AI executive."
        primaryCta={{ label: "Apply for AI Advisory", href: bookingHref }}
        secondaryCta={{ label: "See What's Included", href: "#whats-included" }}
        metrics={[
          { value: <CountUp value={60} suffix="+" />, label: "teams supported" },
          { value: <CountUp value={200} suffix="+" />, label: "tools monitored monthly" },
          { value: "Starting at $3,000", label: "per month" },
        ]}
      />

      {/* ── Section 2 — The Problem ────────────────────────────────── */}
      <section className="advisor-section problem-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">The Problem</p>
            <h2 className="advisor-h2">Why Most Companies Lose Momentum After AI Implementation</h2>
            <p className="advisor-body">
              Most businesses think implementation is the finish line. They invest in tools, run the project, and declare success. But without ongoing leadership, the real costs compound fast: adoption slows, teams fall back to old habits, systems become outdated, new opportunities are missed, tool costs keep rising, and the promised ROI never materializes.
            </p>

            <div className="problem-tags">
              {["Adoption Slows", "Old Habits Return", "Systems Outdated", "Missed Opportunities", "Rising Tool Costs", "Lost ROI"].map((tag) => (
                <span key={tag} className="problem-tag">{tag}</span>
              ))}
            </div>

            <div className="path-diagram">
              <div className="path-row path-row--bad">
                <div className="path-row__label">Bad</div>
                <div className="path-row__steps">
                  {["Implementation", "No Leadership", "Low Adoption", "Stagnation"].map((step, i, arr) => (
                    <div key={step} className="path-step">
                      <span className="path-step__text">{step}</span>
                      {i < arr.length - 1 && <span className="path-step__arrow">→</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="path-row path-row--good">
                <div className="path-row__label">Good</div>
                <div className="path-row__steps">
                  {["Implementation", "Advisory", "Optimization", "Growth"].map((step, i, arr) => (
                    <div key={step} className="path-step">
                      <span className="path-step__text">{step}</span>
                      {i < arr.length - 1 && <span className="path-step__arrow">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 3 — What Is This Service ──────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">What This Is</p>
            <h2 className="advisor-h2">What Is Fractional AI Advisory?</h2>
            <p className="advisor-body what-is-body">
              Fractional AI Advisory is an ongoing strategic partnership where myAImatch works alongside your leadership to continuously guide, optimize, and improve how AI operates across your business. This is not coaching. This is not a monthly check-in service. It is executive-level AI leadership — delivered as a service — so you get the strategic clarity and operational momentum of a Chief AI Officer without the full-time cost.
            </p>

            <div className="focus-grid">
              {[
                "Ongoing AI strategy and prioritization",
                "Workflow and process optimization",
                "Leadership alignment and communication",
                "Tool and vendor evaluation",
                "Team adoption and capability building",
                "AI investment ROI analysis",
                "New opportunity identification",
              ].map((item) => (
                <div key={item} className="focus-item">
                  <div className="focus-item__dot" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 4 — What's Included ────────────────────────────── */}
      <section className="advisor-section included-section" id="whats-included">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">What You Receive</p>
            <h2 className="advisor-h2">What You Receive</h2>
          </Reveal>
          <div className="deliverables-grid">
            {deliverables.map((d, i) => (
              <Reveal key={d.title} delay={i * 60}>
                <TiltCard className="advisor-tilt-card">
                  <div className="advisor-card-inner">
                    <div className="advisor-card-icon">
                      <d.icon size={20} strokeWidth={1.6} aria-hidden />
                    </div>
                    <h3 className="advisor-card-title">{d.title}</h3>
                    <p className="advisor-card-body">{d.body}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — Who This Is For ────────────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Who This Serves</p>
            <h2 className="advisor-h2">This Is For You If…</h2>
          </Reveal>
          <div className="who-for-list">
            {[
              "You already use AI but want stronger business outcomes",
              "Your leadership team needs ongoing strategic guidance",
              "You want better AI adoption across teams and departments",
              "You need help evaluating tools, vendors, and opportunities",
              "You want AI tied to measurable ROI — not experimentation",
              "You want executive-level AI leadership without a full-time hire",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 50}>
                <div className="who-for-item">
                  <div className="who-for-item__check">
                    <svg viewBox="0 0 12 12">
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </div>
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6 — Why Fractional Works ──────────────────────── */}
      <section className="advisor-section why-fractional-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">The Case for Fractional</p>
            <h2 className="advisor-h2">Why Fractional AI Leadership Works Better</h2>
          </Reveal>
          <div className="why-fractional-split">
            <div className="why-fractional-copy">
              <Reveal>
                <p className="advisor-body">
                  Hiring a full-time AI executive is expensive, slow, and often unnecessary. Most companies do not need a full-time Chief AI Officer. They need strategic leadership, clarity, and execution support — available when it matters, not on a fixed payroll.
                </p>
                <div className="why-fractional-bullets">
                  {[
                    "Immediate access to senior AI advisory expertise",
                    "Cross-industry perspective your internal team cannot replicate",
                    "Scales with your pace — not locked to a fixed role",
                    "ROI-focused from day one, not a 6-month onboarding cycle",
                    "No recruiting costs, equity, or benefits overhead",
                  ].map((b) => (
                    <div key={b} className="why-fractional-bullet">{b}</div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="comparison-table">
                <div className="comparison-table__head">
                  <div className="comparison-table__head-cell"></div>
                  <div className="comparison-table__head-cell">Full-Time AI Exec</div>
                  <div className="comparison-table__head-cell is-highlight">Fractional Advisory</div>
                </div>
                {[
                  { label: "Annual cost", fullTime: "$200k–$400k+", fractional: "Starting at $36k" },
                  { label: "Time to start", fullTime: "3–6 months", fractional: "Immediate" },
                  { label: "Strategic scope", fullTime: "Internal only", fractional: "Cross-industry insight" },
                  { label: "Flexibility", fullTime: "Fixed role", fractional: "Scales with needs" },
                ].map((row) => (
                  <div key={row.label} className="comparison-table__row">
                    <div className="comparison-table__cell is-label">{row.label}</div>
                    <div className="comparison-table__cell">{row.fullTime}</div>
                    <div className="comparison-table__cell is-highlight">{row.fractional}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section 7 — Pricing ────────────────────────────────────── */}
      <section className="advisor-section pricing-section" id="pricing">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Advisory Investment</p>
            <h2 className="advisor-h2">Advisory Investment</h2>
            <p className="pricing-intro">
              Every company requires a different level of strategic support depending on operational complexity, leadership needs, and growth stage.
            </p>
          </Reveal>
          <div className="pricing-tier-grid">
            <Reveal delay={60}>
              <div className="tier-card">
                <p className="tier-name">Growth Advisory</p>
                <div className="tier-price">$3,000<span>/mo</span></div>
                <p className="tier-desc">
                  Strategic advisory sessions, ongoing workflow optimization review, and async support for leadership decisions.
                </p>
                <Link href={bookingHref} className="tier-cta">
                  Apply for Advisory
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="tier-card featured">
                <div className="tier-badge">Most Strategic</div>
                <p className="tier-name">Strategic Partner</p>
                <div className="tier-price">$5,000<span>+/mo</span></div>
                <p className="tier-desc">
                  Higher-touch advisory with expanded leadership support, deeper operational involvement, and priority access across your team.
                </p>
                <Link href={bookingHref} className="tier-cta">
                  Apply for Advisory
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section 8 — Why myAImatch ──────────────────────────────── */}
      <section className="advisor-section authority-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Why myAImatch</p>
            <h2 className="advisor-h2">Why Companies Choose myAImatch</h2>
            <p className="authority-body">
              We do not sell tools. We do not earn commissions. myAImatch helps leadership make better AI decisions — with full independence and strategic clarity. Our advisors bring operational experience across industries, so the guidance you receive is grounded in what actually works at scale, not what sounds good in a pitch deck. AI is a business capability, not a software purchase. The companies that win with AI build strategic leadership systems first — and that is what we help you build.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="authority-metrics">
              {[
                { value: 60, suffix: "+", label: "Teams advised" },
                { value: 200, suffix: "+", label: "Tools evaluated monthly" },
                { value: 3, suffix: "", label: "Services, 1 strategic partner" },
                { value: 0, suffix: "", label: "In wasted tool spend" },
              ].map((m) => (
                <div key={m.label} className="authority-metric">
                  <div className="authority-metric__number">
                    <CountUp value={m.value} suffix={m.suffix} />
                  </div>
                  <div className="authority-metric__label">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 9 — FAQ ───────────────────────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell faq-section">
          <Reveal>
            <p className="advisor-eyebrow">Common Questions</p>
            <h2 className="advisor-h2">Common Questions</h2>
          </Reveal>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ── Section 10 — Final CTA ────────────────────────────────── */}
      <section className="final-cta-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="final-cta-eyebrow">Ready for executive AI leadership?</p>
            <h2 className="final-cta-title">AI Leadership Is Not Optional Anymore</h2>
            <p className="final-cta-body">
              The companies that win with AI make better strategic decisions — not just better tools. Before you hire another executive. Before you invest in another platform. Before you lose momentum. Build the leadership system first.
            </p>
            <Link href={bookingHref} className="final-cta-btn">
              Apply for Fractional AI Advisory
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
