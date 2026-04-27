import Link from "next/link";
import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import TiltCard from "@/components/services/TiltCard";
import Reveal from "@/components/services/Reveal";
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
    "Executive-level AI leadership without the full-time hire. myAImatch provides strategic advisory, workflow optimization, leadership alignment, and AI investment guidance — custom advisory plans tailored to your needs.",
  openGraph: {
    title: "Fractional AI Advisor | Executive AI Leadership | myAImatch",
    description:
      "Executive-level AI leadership without the full-time hire. myAImatch provides strategic advisory, workflow optimization, leadership alignment, and AI investment guidance — custom advisory plans tailored to your needs.",
    url: "https://myaimatch.ai/fractional-ai-advisor",
    type: "website",
  },
};

const bookingHref = process.env.NEXT_PUBLIC_CAL_COACHING_URL || "#pricing";

const deliverables = [
  {
    icon: Phone,
    title: "Monthly Strategic Advisory Calls",
  },
  {
    icon: RefreshCw,
    title: "Workflow Optimization",
  },
  {
    icon: Target,
    title: "AI Investment Prioritization",
  },
  {
    icon: Lightbulb,
    title: "New Opportunity Identification",
  },
  {
    icon: ShieldCheck,
    title: "Vendor + Tool Evaluation",
  },
  {
    icon: Users,
    title: "Internal Team Guidance",
  },
  {
    icon: Target,
    title: "Leadership Decision Support",
  },
  {
    icon: Zap,
    title: "Priority Strategic Access",
  },
];

const readinessItems = [
  "completed your AI Strategy Roadmap",
  "implemented core AI systems",
  "internal teams already using AI",
  "leadership ready to scale adoption",
];

const processSteps = [
  {
    title: "Step 1 — Strategic Fit Call",
    body: "We assess priorities, leadership needs, and operational complexity.",
  },
  {
    title: "Step 2 — Advisory Scope",
    body: "We define support structure, strategic priorities, and communication flow.",
  },
  {
    title: "Step 3 — Custom Monthly Proposal",
    body: "You receive a tailored advisory engagement based on your business needs.",
  },
  {
    title: "Step 4 — Strategic Advisory Begins",
    body: "Monthly leadership calls, optimization planning, and priority support begin.",
  },
  {
    title: "Step 5 — Continuous Improvement",
    body: "We continuously identify new opportunities, risks, and strategic decisions.",
  },
];

const faqItems = [
  {
    question: "Do I need Implementation first?",
    answer:
      "Usually, yes. Fractional Advisory creates the most value after strategy and implementation are already in place. This ensures we are optimizing real systems—not advising in theory.",
  },
  {
    question: "How involved are you with leadership?",
    answer:
      "We work directly with founders, CEOs, COOs, department heads, and other decision-makers who own AI priorities, operational performance, and investment decisions.",
  },
  {
    question: "Is this for small businesses or larger teams?",
    answer:
      "It is best for businesses with enough AI momentum, operational complexity, and leadership alignment to benefit from ongoing strategic guidance. That can include growth-stage companies, mid-market teams, and founder-led businesses ready to scale adoption.",
  },
  {
    question: "Can this replace hiring an internal AI lead?",
    answer:
      "For many businesses, yes. Fractional Advisory gives leadership access to strategic AI guidance without immediately hiring a full-time internal AI executive. If the business eventually needs an internal lead, advisory can also help define that role.",
  },
  {
    question: "Is this consulting or coaching?",
    answer:
      "This is strategic AI advisory. We help leadership make better AI decisions, prioritize investments, optimize real systems, and identify the next highest-impact opportunities.",
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

        /* ── Section 3 — What Is This ─────────────────────────── */
        .what-is-body {
          max-width: 640px;
          margin-bottom: 40px;
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
          margin: 0;
          line-height: 1.4;
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

        .tier-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
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

        .process-list {
          display: grid;
          gap: 14px;
          margin-top: 48px;
        }

        .process-step {
          display: grid;
          grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          padding: 22px 24px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
        }

        .process-step h3 {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .process-step p {
          margin: 0;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.65;
        }

        @media (max-width: 760px) {
          .process-step {
            grid-template-columns: 1fr;
          }
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
        title="Strategic AI Leadership —"
        highlightedTitle="Without Hiring a Full-Time AI Executive"
        body="We help leadership teams make smarter AI decisions, prioritize the right investments, optimize operations, and continuously identify where AI creates the highest business impact."
        primaryCta={{ label: "Apply for Fractional AI Advisory", href: bookingHref }}
        secondaryCta={{ label: "See What's Included", href: "#whats-included" }}
      />

      {/* ── Section 2 — Not Monthly Support ───────────────────────── */}
      <section className="advisor-section problem-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Strategic leadership</p>
            <h2 className="advisor-h2">This Is Not Monthly Support</h2>
            <p className="advisor-body">
              This is not ongoing “AI help.”
              <br /><br />
              This is strategic leadership.
              <br /><br />
              We work with your leadership team to evaluate priorities, guide AI decisions, improve operational performance, and ensure AI investments create measurable business outcomes.
              <br /><br />
              You are not paying for support.
              <br /><br />
              You are investing in strategic decision-making.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Section 3 — What We Help You Lead ─────────────────────── */}
      <section className="advisor-section included-section" id="whats-included">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">What we do</p>
            <h2 className="advisor-h2">What We Help You Lead</h2>
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
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Momentum Fit ──────────────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Best fit</p>
            <h2 className="advisor-h2">Designed for Businesses Already Moving With AI</h2>
            <p className="advisor-body what-is-body">
              Fractional Advisory works best for companies that already have momentum.
              <br /><br />
              You may have:
            </p>
          </Reveal>
          <div className="who-for-list">
            {readinessItems.map((item, i) => (
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

      {/* ── Section 5 — Custom Advisory ───────────────────────────── */}
      <section className="advisor-section pricing-section" id="pricing">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Custom advisory</p>
            <h2 className="advisor-h2">Custom Advisory Engagement</h2>
            <p className="pricing-intro">
              Every business requires a different level of strategic involvement.
              <br /><br />
              The right advisory structure depends on leadership access, operational complexity, support requirements, and business priorities.
              <br /><br />
              We create a custom monthly engagement based on your specific needs.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div className="tier-card featured" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <p className="tier-name">Fractional AI Advisory</p>
              <Link href={bookingHref} className="tier-cta" style={{ marginTop: "28px", display: "inline-flex", width: "auto" }}>
                Apply for Fractional AI Advisory
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 6 — Process ───────────────────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="advisor-eyebrow">Process</p>
            <h2 className="advisor-h2">How Fractional Advisory Works</h2>
          </Reveal>
          <div className="process-list">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 50}>
                <div className="process-step">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7 — FAQ ───────────────────────────────────────── */}
      <section className="advisor-section">
        <div className="advisor-shell faq-section">
          <Reveal>
            <p className="advisor-eyebrow">Common Questions</p>
            <h2 className="advisor-h2">Common Questions</h2>
          </Reveal>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ── Section 8 — Final CTA ────────────────────────────────── */}
      <section className="final-cta-section">
        <div className="advisor-shell">
          <Reveal>
            <p className="final-cta-eyebrow">Ready for strategic AI leadership?</p>
            <h2 className="final-cta-title">Lead AI With Better Strategic Decisions</h2>
            <p className="final-cta-body">
              Keep improving the systems you have, prioritize the right investments, and give leadership the clarity to scale AI with confidence.
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
