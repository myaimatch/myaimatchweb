import Link from "next/link";
import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import TiltCard from "@/components/services/TiltCard";
import Reveal from "@/components/services/Reveal";
import CountUp from "@/components/services/CountUp";
import FaqAccordion from "@/components/services/FaqAccordion";
import {
  Search,
  GitBranch,
  BarChart3,
  Layers,
  Route,
  TrendingUp,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Workflow Audit + Strategy Roadmap | myAImatch",
  description:
    "Stop buying random AI tools. myAImatch maps your workflows, identifies the highest ROI opportunities, and builds a custom AI strategy roadmap with a 30-60-90 day implementation plan and executive report.",
  openGraph: {
    title: "AI Workflow Audit + Strategy Roadmap | myAImatch",
    description:
      "Stop buying random AI tools. myAImatch maps your workflows, identifies the highest ROI opportunities, and builds a custom AI strategy roadmap with a 30-60-90 day implementation plan and executive report.",
    url: "https://myaimatch.ai/ai-strategy-roadmap",
    type: "website",
  },
};

const bookingHref =
  process.env.NEXT_PUBLIC_CAL_STRATEGY_SOLO_URL || "#pricing";

const deliverables = [
  {
    Icon: Search,
    eyebrow: "01",
    title: "Strategic Discovery Session",
    body: "Deep-dive consultation into your operations, workflows, and business goals.",
  },
  {
    Icon: GitBranch,
    eyebrow: "02",
    title: "Workflow & Process Audit",
    body: "Identify bottlenecks, repetitive tasks, inefficiencies, and automation opportunities.",
  },
  {
    Icon: BarChart3,
    eyebrow: "03",
    title: "AI Opportunity Matrix",
    body: "Prioritized list of the highest ROI opportunities — the right sequence matters.",
  },
  {
    Icon: Layers,
    eyebrow: "04",
    title: "Recommended AI Tool Stack",
    body: "Best-fit tools for your business based on operations — not hype.",
  },
  {
    Icon: Route,
    eyebrow: "05",
    title: "30-60-90 Day Implementation Plan",
    body: "A clear roadmap for execution and adoption, structured week by week.",
  },
  {
    Icon: TrendingUp,
    eyebrow: "06",
    title: "ROI Projection",
    body: "Estimated savings in time, cost, and operational efficiency.",
  },
  {
    Icon: FileText,
    eyebrow: "07",
    title: "Executive Strategy Report",
    body: "A professional PDF roadmap your leadership team can act on immediately.",
  },
];

const whoFor = [
  "You know AI matters, but don't know where to start",
  "Your team is overwhelmed by too many tools",
  "You want operational efficiency, not AI hype",
  "You want to automate strategically — not blindly",
  "You need leadership clarity before implementation",
  "You want measurable ROI, not experimentation",
];

const faqs = [
  {
    question: "Can we skip this and go straight to implementation?",
    answer:
      "Sometimes — but only if your internal processes and roadmap are already clearly defined. Most companies save far more by starting with strategy first. Without it, implementation often automates broken processes instead of fixing them.",
  },
  {
    question: "How long does the process take?",
    answer:
      "Typically 1–2 weeks depending on business complexity. The strategy session itself is focused and structured — followed by our team delivering the full report and roadmap.",
  },
  {
    question: "Do you work with small businesses?",
    answer:
      "Yes — if operational transformation is a serious priority. The strategy is tailored to your operational complexity, not your company size.",
  },
  {
    question: "Is this only for large companies?",
    answer:
      "Not at all. myAImatch works with businesses at every stage. What matters is whether AI transformation is a real priority — not how many employees you have.",
  },
  {
    question: "What happens after the roadmap is delivered?",
    answer:
      "You can implement it internally with your team, hand it to your developers, or have myAImatch support the implementation directly. The roadmap is built to work either way.",
  },
];

export default function AIStrategyRoadmapPage() {
  return (
    <div className="services-page bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .services-page {
          --service-primary: #8468EB;
          --service-accent: #C4B5FD;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          background-color: #111111;
          color: #ffffff;
          overflow: hidden;
        }

        .services-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .services-label {
          margin-bottom: 14px;
          color: var(--service-primary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .services-section-title {
          color: #ffffff;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .services-section-body {
          margin-top: 18px;
          color: var(--service-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .services-cta-primary,
        .services-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          border-radius: 999px;
          padding: 0 28px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .services-cta-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          border: 1px solid rgba(196,181,253,0.24);
          box-shadow: 0 8px 28px rgba(91,66,195,0.34), 0 0 26px rgba(132,104,235,0.12);
        }

        .services-cta-secondary {
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .services-cta-primary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 12px 34px rgba(91,66,195,0.42), 0 0 34px rgba(132,104,235,0.2);
        }

        .services-cta-secondary:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }

        .services-cta-primary:active,
        .services-cta-secondary:active {
          transform: scale(0.97);
          transition: transform 80ms ease;
        }

        .services-cta-primary:focus-visible,
        .services-cta-secondary:focus-visible {
          outline: 2px solid #C4B5FD;
          outline-offset: 3px;
        }

        .services-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--service-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(132,104,235,0.18), transparent 70%),
            var(--service-surface);
        }

        /* ── SECTION 2: PROBLEM ── */
        .problem-section {
          padding: 100px 0 108px;
          position: relative;
        }

        .problem-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 60%, rgba(132,104,235,0.07), transparent 72%);
          pointer-events: none;
        }

        .problem-content {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .problem-intro {
          margin: 24px auto 0;
          max-width: 640px;
          color: rgba(255,255,255,0.6);
          font-size: 17px;
          line-height: 1.8;
        }

        .problem-points {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin: 28px auto 0;
          max-width: 540px;
        }

        .problem-point {
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
        }

        .path-diagram {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .path-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 24px;
          border-radius: 18px;
          flex-wrap: wrap;
        }

        .path-row--bad {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          opacity: 0.72;
        }

        .path-row--good {
          background:
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(132,104,235,0.16), transparent 80%),
            rgba(132,104,235,0.05);
          border: 1px solid rgba(132,104,235,0.28);
          box-shadow: 0 0 40px rgba(132,104,235,0.08);
        }

        .path-badge {
          flex-shrink: 0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .path-badge--bad {
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .path-badge--good {
          color: #C4B5FD;
          background: rgba(132,104,235,0.16);
          border: 1px solid rgba(132,104,235,0.3);
        }

        .path-steps {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .path-step {
          padding: 5px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .path-row--bad .path-step {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.38);
          text-decoration: line-through;
          text-decoration-color: rgba(255,255,255,0.18);
        }

        .path-row--good .path-step {
          background: rgba(132,104,235,0.14);
          border: 1px solid rgba(132,104,235,0.22);
          color: rgba(255,255,255,0.88);
        }

        .path-arrow {
          font-size: 14px;
          font-weight: 700;
        }

        .path-row--bad .path-arrow { color: rgba(255,255,255,0.16); }
        .path-row--good .path-arrow { color: rgba(132,104,235,0.6); }

        .path-outcome {
          margin-left: auto;
          flex-shrink: 0;
          padding: 5px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .path-row--bad .path-outcome {
          color: rgba(239,68,68,0.72);
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.14);
        }

        .path-row--good .path-outcome {
          color: #86efac;
          background: rgba(134,239,172,0.07);
          border: 1px solid rgba(134,239,172,0.16);
        }

        /* ── SECTION 3: WHAT IS THIS ── */
        .what-section {
          padding: 100px 0;
          text-align: center;
          position: relative;
        }

        .what-section::before {
          content: "";
          position: absolute;
          left: 50%; top: 0;
          width: 2px; height: 100px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.4), transparent);
          pointer-events: none;
        }

        .what-body {
          margin: 28px auto 0;
          max-width: 680px;
          color: rgba(255,255,255,0.6);
          font-size: 17px;
          line-height: 1.85;
        }

        .what-note {
          margin: 20px auto 0;
          max-width: 500px;
          color: rgba(255,255,255,0.38);
          font-size: 14px;
          font-style: italic;
          line-height: 1.6;
        }

        /* ── SECTION 4: DELIVERABLES ── */
        .deliverables-section {
          padding: 100px 0 108px;
        }

        .deliverables-grid {
          margin-top: 52px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .deliverable-card-inner {
          padding: 28px;
          min-height: 210px;
          display: flex;
          flex-direction: column;
        }

        .deliverable-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(132,104,235,0.14);
          border: 1px solid rgba(132,104,235,0.22);
          color: #C4B5FD;
          flex-shrink: 0;
        }

        .deliverable-eyebrow {
          margin-top: 20px;
          color: rgba(196,181,253,0.65);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .deliverable-title {
          margin-top: 10px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .deliverable-body-text {
          margin-top: 10px;
          color: rgba(255,255,255,0.52);
          font-size: 13.5px;
          line-height: 1.7;
          flex: 1;
        }

        /* Center last card when it's alone in a row */
        .deliverables-grid > *:last-child:nth-child(3n+1) {
          grid-column: 2;
        }

        /* PDF mockup accent at bottom of deliverables */
        .pdf-mockup {
          margin: 40px auto 0;
          max-width: 680px;
          padding: 28px 32px;
          border: 1px solid rgba(132,104,235,0.22);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.14), transparent 70%),
            rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pdf-mockup-icon {
          flex-shrink: 0;
          width: 56px;
          height: 68px;
          border-radius: 8px;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.9);
          border: 1px solid rgba(196,181,253,0.24);
        }

        .pdf-mockup-text strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .pdf-mockup-text span {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          line-height: 1.5;
        }

        /* ── SECTION 5: WHO FOR ── */
        .who-section {
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }

        .who-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(132,104,235,0.07), transparent 72%);
          pointer-events: none;
        }

        .who-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 44px;
          max-width: 840px;
          margin-left: auto;
          margin-right: auto;
        }

        .who-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid #8468EB;
          border-radius: 0 12px 12px 0;
          background: rgba(255,255,255,0.025);
          transition: background 160ms ease, border-color 160ms ease;
        }

        .who-item:hover {
          background: rgba(255,255,255,0.04);
          border-left-color: #C4B5FD;
        }

        .who-check {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(132,104,235,0.16);
          border: 1px solid rgba(132,104,235,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C4B5FD;
          font-size: 11px;
          font-weight: 800;
          margin-top: 1px;
        }

        .who-text {
          color: rgba(255,255,255,0.78);
          font-size: 14px;
          line-height: 1.6;
          font-weight: 500;
        }

        /* ── SECTION 6: PRICING ── */
        .pricing-section {
          padding: 100px 0 108px;
        }

        .pricing-solo-card {
          position: relative;
          overflow: hidden;
          max-width: 660px;
          margin: 52px auto 0;
          padding: 52px 48px;
          border: 1px solid rgba(132,104,235,0.32);
          border-radius: 24px;
          background:
            radial-gradient(ellipse 100% 80% at 50% 0%, rgba(132,104,235,0.22), transparent 68%),
            rgba(255,255,255,0.04);
          box-shadow: 0 0 72px rgba(132,104,235,0.1), 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }

        .pricing-solo-card::before {
          content: "";
          position: absolute;
          left: 50%; top: 0;
          width: 2px; height: 80px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.7), transparent);
          pointer-events: none;
        }

        .pricing-desc {
          margin-top: 16px;
          color: rgba(255,255,255,0.56);
          font-size: 15px;
          line-height: 1.75;
          max-width: 460px;
          margin-left: auto;
          margin-right: auto;
        }

        .pricing-amount {
          margin-top: 36px;
          color: #8468EB;
          font-size: clamp(52px, 7vw, 76px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1;
        }

        .pricing-amount-label {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.36);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .pricing-sub {
          margin-top: 18px;
          color: rgba(255,255,255,0.48);
          font-size: 13.5px;
          line-height: 1.6;
        }

        .pricing-cta-wrap {
          margin-top: 36px;
        }

        .pricing-note {
          margin-top: 16px;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
        }

        /* ── SECTION 7: FAQ ── */
        .faq-section {
          padding: 100px 0 108px;
          position: relative;
        }

        .faq-container {
          max-width: 760px;
          margin: 0 auto;
        }

        /* ── SECTION 8: FINAL CTA ── */
        .final-cta-section {
          position: relative;
          overflow: hidden;
          margin: 0 16px 80px;
          padding: clamp(56px, 7vw, 88px) clamp(28px, 5vw, 72px);
          border: 1px solid rgba(132,104,235,0.28);
          border-radius: 28px;
          background: linear-gradient(135deg, #6B4FBB 0%, #8468EB 50%, #5B42C3 100%);
          text-align: center;
        }

        .final-cta-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(255,255,255,0.14), transparent 60%);
          pointer-events: none;
        }

        .final-cta-section::after {
          content: "";
          position: absolute;
          left: 50%; top: 0;
          width: 2px; height: 110px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(255,255,255,0.55), transparent);
          pointer-events: none;
        }

        .final-cta-eyebrow {
          position: relative;
          z-index: 1;
          display: inline-block;
          margin-bottom: 18px;
          color: rgba(255,255,255,0.62);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .final-cta-title {
          position: relative;
          z-index: 1;
          color: #ffffff;
          font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 800;
          letter-spacing: -0.028em;
          line-height: 1.08;
        }

        .final-cta-body {
          position: relative;
          z-index: 1;
          margin-top: 22px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(255,255,255,0.72);
          font-size: 16px;
          line-height: 1.78;
        }

        .final-cta-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 40px;
          min-height: 58px;
          padding: 0 40px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px;
          background: #ffffff;
          color: #311B92;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(0,0,0,0.22);
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .final-cta-btn:hover { opacity: 0.94; transform: translateY(-2px); }
        .final-cta-btn:focus-visible { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 3px; }
        .final-cta-btn:active { transform: scale(0.97); transition: transform 80ms ease; }

        /* ── RESPONSIVE ── */
        @media (max-width: 980px) {
          .deliverables-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .deliverables-grid > *:last-child:nth-child(3n+1) { grid-column: auto; }
        }

        @media (max-width: 760px) {
          .who-grid { grid-template-columns: 1fr; }
          .pdf-mockup { flex-direction: column; text-align: center; gap: 14px; }
        }

        @media (max-width: 640px) {
          .services-shell { width: min(100% - 24px, 1180px); }
          .deliverables-grid { grid-template-columns: 1fr; }
          .pricing-solo-card { padding: 36px 24px; }
          .path-row { padding: 16px; gap: 10px; }
          .path-outcome { margin-left: 0; }
          .final-cta-section { margin: 0 0 60px; border-radius: 0; border-left: none; border-right: none; }
          .services-cta-primary, .services-cta-secondary { width: 100%; }
        }
      ` }} />

      {/* ── SECTION 1: HERO ── */}
      <ServiceHero
        label="AI Workflow Audit + Strategy Roadmap"
        title="Stop Buying Random AI Tools."
        highlightedTitle="Build the Right AI Strategy First."
        body="Most businesses waste thousands on AI tools they never fully use. Before implementation, you need clarity on what to automate, where the highest ROI exists, and which AI systems fit your operations. This strategic roadmap gives you the exact plan — no guesswork, no wasted spend, no shiny object syndrome."
        primaryCta={{ label: "Book Your Strategy Call", href: bookingHref }}
        secondaryCta={{ label: "See What's Included", href: "#whats-included" }}
        variant="strategy"
        metrics={[
          { value: <CountUp value={120} suffix="+" />, label: "operators matched" },
          { value: <CountUp value={275} suffix="+" />, label: "AI tools reviewed" },
          { value: "Starting at $2,500", label: "strategy investment" },
        ]}
      />

      {/* ── SECTION 2: THE PROBLEM ── */}
      <section className="problem-section">
        <div className="services-shell">
          <Reveal>
            <div className="problem-content">
              <p className="services-label">Why most AI initiatives fail</p>
              <h2 className="services-section-title">Why Most AI Implementations Fail</h2>
              <p className="problem-intro">
                Businesses do not fail with AI because the tools are bad.
                They fail because they implement before they diagnose. They buy software
                before understanding their workflows. They automate broken processes.
                They chase trends instead of solving business problems.
              </p>
              <div className="problem-points">
                {["Wasted budget", "Poor adoption", "Frustrated teams", "Broken operations", "Zero ROI"].map((p) => (
                  <span key={p} className="problem-point">{p}</span>
                ))}
              </div>
              <div className="path-diagram" aria-label="AI implementation paths comparison">
                <div className="path-row path-row--bad">
                  <span className="path-badge path-badge--bad">Without Strategy</span>
                  <div className="path-steps">
                    <span className="path-step">Buy Tool</span>
                    <span className="path-arrow">→</span>
                    <span className="path-step">Confusion</span>
                    <span className="path-arrow">→</span>
                    <span className="path-step">Poor Adoption</span>
                  </div>
                  <span className="path-outcome">Failure</span>
                </div>
                <div className="path-row path-row--good">
                  <span className="path-badge path-badge--good">With myAImatch</span>
                  <div className="path-steps">
                    <span className="path-step">Audit</span>
                    <span className="path-arrow">→</span>
                    <span className="path-step">Strategy</span>
                    <span className="path-arrow">→</span>
                    <span className="path-step">Implement</span>
                  </div>
                  <span className="path-outcome">ROI</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: WHAT IS THIS ── */}
      <section className="what-section">
        <div className="services-shell">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <p className="services-label">What we do</p>
              <h2 className="services-section-title">
                What Is the AI Workflow Audit + Strategy Roadmap?
              </h2>
              <p className="what-body">
                This is a strategic consulting engagement designed to identify where AI creates
                the highest business impact first. We analyze your workflows, operations,
                inefficiencies, and growth opportunities to build a practical implementation
                roadmap tailored to your company.
              </p>
              <p className="what-note">
                This is not generic advice. This is a custom AI transformation strategy built
                around your actual business operations.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: DELIVERABLES ── */}
      <section id="whats-included" className="deliverables-section">
        <div className="services-shell">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="services-label">What is included</p>
              <h2 className="services-section-title">What You Will Receive</h2>
              <p className="services-section-body">
                Every engagement delivers a complete strategic package — not a 1-pager,
                not a generic template. A custom roadmap built around your business.
              </p>
            </div>
          </Reveal>

          <div className="deliverables-grid">
            {deliverables.map((item, i) => (
              <Reveal key={item.title} delay={60 + i * 60}>
                <TiltCard className="services-card">
                  <div className="deliverable-card-inner">
                    <div className="deliverable-icon-wrap">
                      <item.Icon size={20} aria-hidden />
                    </div>
                    <p className="deliverable-eyebrow">{item.eyebrow}</p>
                    <h3 className="deliverable-title">{item.title}</h3>
                    <p className="deliverable-body-text">{item.body}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="pdf-mockup">
              <div className="pdf-mockup-icon">
                <FileText size={26} />
              </div>
              <div className="pdf-mockup-text">
                <strong>Executive Strategy Report — PDF</strong>
                <span>
                  A professional, branded document your leadership team can review,
                  distribute, and act on — delivered within the engagement timeline.
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: WHO THIS IS FOR ── */}
      <section className="who-section">
        <div className="services-shell">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="services-label">Is this right for you?</p>
              <h2 className="services-section-title">This Is For You If…</h2>
            </div>
          </Reveal>
          <div className="who-grid">
            {whoFor.map((item, i) => (
              <Reveal key={item} delay={60 + i * 50}>
                <div className="who-item">
                  <span className="who-check" aria-hidden>✓</span>
                  <span className="who-text">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PRICING ── */}
      <section id="pricing" className="pricing-section">
        <div className="services-shell">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="services-label">Investment</p>
              <h2 className="services-section-title">Investment</h2>
              <p className="services-section-body">
                Every business has different operational complexity. Strategy engagements are
                tailored based on team size, workflow depth, and implementation scope.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="pricing-solo-card">
              <p className="services-label" style={{ marginBottom: 0 }}>Strategy engagement</p>
              <div className="pricing-amount">
                $2,500
                <span className="pricing-amount-label">Starting investment</span>
              </div>
              <p className="pricing-desc">
                For businesses ready to stop guessing and build a real AI strategy. Custom
                engagements available for larger teams and complex multi-department operations.
              </p>
              <p className="pricing-sub">
                Custom strategic engagements available for enterprise and complex operations.
              </p>
              <div className="pricing-cta-wrap">
                <Link href={bookingHref} className="services-cta-primary">
                  Apply for Your Strategy Roadmap
                </Link>
              </div>
              <p className="pricing-note">
                Premium consulting engagement — not a self-serve product.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ── */}
      <section className="faq-section">
        <div className="services-shell">
          <div className="faq-container">
            <Reveal>
              <div className="text-center">
                <p className="services-label">Questions</p>
                <h2 className="services-section-title">Common Questions</h2>
              </div>
            </Reveal>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FINAL CTA ── */}
      <section aria-label="Apply for AI Strategy Roadmap">
        <div className="final-cta-section">
          <Reveal>
            <p className="final-cta-eyebrow">Ready to build your roadmap?</p>
            <h2 className="final-cta-title">AI Success Starts With Strategy</h2>
            <p className="final-cta-body">
              Before you invest in more tools,<br />
              before you hire more people,<br />
              before you automate the wrong things —<br />
              <br />
              build the right roadmap first.
              That is where real transformation begins.
            </p>
            <div>
              <Link href={bookingHref} className="final-cta-btn">
                Apply for Your AI Strategy Roadmap
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
