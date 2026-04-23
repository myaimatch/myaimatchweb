import Link from "next/link";
import type { Metadata } from "next";
import CountUp from "@/components/services/CountUp";
import BeforeAfterStack from "@/components/services/BeforeAfterStack";
import BlueprintDiagram from "@/components/services/BlueprintDiagram";
import Reveal from "@/components/services/Reveal";
import ServiceHero from "@/components/services/ServiceHero";
import StackConstellation from "@/components/services/StackConstellation";
import TiltCard from "@/components/services/TiltCard";

export const metadata: Metadata = {
  title: "Full AI Strategy Assessment | myAIMatch",
  description:
    "Book a paid 60-minute strategy session and get a clear AI stack roadmap built around your workflows, team, budget, goals, industry, and use case.",
  openGraph: {
    title: "Full AI Strategy Assessment | myAIMatch",
    description:
      "Book a paid 60-minute strategy session and get a clear AI stack roadmap built around your workflows, team, budget, goals, industry, and use case.",
    url: "https://myaimatch.ai/services/full-ai-strategy-assessment",
    type: "website",
  },
};

type Tier = {
  name: string;
  price: string;
  description: string;
  scope: string[];
};

const strategyBookingHref = process.env.NEXT_PUBLIC_CAL_STRATEGY_URL || "#pricing";

const deliverables = [
  {
    eyebrow: "01",
    title: "Your workflow, audited",
    body: "What you do today, where it leaks time, where AI can actually take over — mapped in session.",
  },
  {
    eyebrow: "02",
    title: "Your custom AI stack",
    body: "Specific tools chosen for your role, team, and budget. Not a generic top-10 list.",
  },
  {
    eyebrow: "03",
    title: "A phased rollout plan",
    body: "What to set up this week, this month, this quarter. Plus what to skip entirely.",
  },
  {
    eyebrow: "04",
    title: "Recording + written report",
    body: "Everything we decided, ready to hand to your team, dev, or implementer.",
  },
];

const deliverableDiagrams = ["audit", "stack", "rollout", "report"] as const;

const testimonials = [
  {
    quote: "We went from 32 AI tools to 6. My team actually uses all of them now.",
    name: "Sarah Chen",
    role: "COO, Nomad Agency",
  },
  {
    quote: "The roadmap paid for itself in the first month. No more SaaS bloat, no more guessing.",
    name: "Marcus Webb",
    role: "Founder, Loop Creative",
  },
  {
    quote: "I came in overwhelmed. I left with a plan I could hand to my VA the same week.",
    name: "Priya Ramirez",
    role: "Freelance Product Designer",
  },
];

const tiers: Tier[] = [
  {
    name: "Solo / Freelancer",
    price: "$2,000",
    description:
      "For one operator who needs a focused stack for personal productivity, client delivery, or one core workflow.",
    scope: [
      "Paid 60-minute 1:1 strategy session",
      "Review of 1 primary workflow and current tools",
      "Recommended tools by use case",
      "Priority implementation order",
      "Budget and setup complexity notes",
      "Final roadmap, recording, and next-step action plan",
    ],
  },
  {
    name: "Small Team",
    price: "$5,000",
    description:
      "For teams with shared workflows, multiple roles, and handoffs that need clearer tools, ownership, and adoption.",
    scope: [
      "Paid 60-minute team strategy session",
      "Review of shared workflows, bottlenecks, and current tools",
      "Recommended stack by role, workflow, and use case",
      "Integration roadmap for shared tools and handoffs",
      "Team adoption notes and what-to-avoid guidance",
      "Final roadmap, recording, and priority action plan",
    ],
  },
  {
    name: "SMB / Multi-Team",
    price: "$10,000",
    description:
      "For businesses with multiple workflows, teams, or departments where implementation order and risk reduction matter.",
    scope: [
      "Paid 60-minute executive strategy session",
      "Cross-team workflow and tool-stack review",
      "Use-case recommendations across teams or departments",
      "Phased integration roadmap and rollout sequence",
      "Risk, budget, and adoption considerations",
      "Final report, recording, and clear implementation priorities",
    ],
  },
];

function SectionHeader({
  label,
  title,
  body,
  align = "center",
}: {
  label: string;
  title: string;
  body: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="services-label">{label}</p>
      <h2 className="services-section-title">{title}</h2>
      <p className="services-section-body">{body}</p>
    </div>
  );
}

export default function StrategyAssessmentPage() {
  return (
    <div className="services-page bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .services-page {
          --service-primary: #8468EB;
          --service-accent: #C4B5FD;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          --service-dim: rgba(255,255,255,0.4);
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
          font-size: clamp(32px, 5vw, 56px);
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
          min-height: 48px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, border-color 180ms ease;
        }

        .services-cta-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          border: 1px solid rgba(223,122,254,0.32);
        }

        .services-cta-secondary {
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .services-cta-primary:hover,
        .services-cta-secondary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        .services-cta-primary:active,
        .services-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
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

        .services-card::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -42px;
          width: 220px;
          height: 90px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(132,104,235,0.48), transparent 70%);
          filter: blur(10px);
          opacity: 0.28;
          pointer-events: none;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .services-card:hover::after {
          opacity: 0.48;
          transform: translateX(-50%) scale(1.08);
        }

        .services-hero {
          position: relative;
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          padding: 92px 0 110px;
          background:
            linear-gradient(180deg, rgba(132,104,235,0.18), transparent 34%),
            radial-gradient(ellipse 72% 42% at 50% 14%, rgba(132,104,235,0.34), transparent 68%),
            #000000;
        }

        .services-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 88px 88px;
          mask-image: radial-gradient(ellipse 70% 55% at 50% 20%, black, transparent 76%);
          pointer-events: none;
        }

        .services-hero::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 180px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.74), transparent);
          pointer-events: none;
        }

        .services-hero-title {
          margin: 0 auto;
          max-width: 920px;
          color: #ffffff;
          font-size: clamp(48px, 9vw, 112px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.93;
        }

        .services-hero-title span {
          background: linear-gradient(135deg, #ffffff 8%, #C4B5FD 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .strategy-outcomes {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 48px auto 0;
          width: min(900px, 100%);
        }

        .strategy-outcome {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          padding: 18px;
          text-align: left;
        }

        .strategy-outcome strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .strategy-outcome span {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.52);
          font-size: 13px;
          line-height: 1.6;
        }

        .strategy-metrics {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 28px auto 0;
          padding: 10px 22px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          background: rgba(255,255,255,0.025);
          color: rgba(255,255,255,0.62);
          font-size: 13px;
          letter-spacing: 0.01em;
        }

        .strategy-metrics strong {
          color: #ffffff;
          font-weight: 700;
          margin-right: 6px;
        }

        .strategy-metrics-divider {
          color: rgba(255,255,255,0.24);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .testimonial-card {
          margin: 0;
          padding: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(132,104,235,0.12), transparent 70%),
            rgba(255,255,255,0.035);
        }

        .testimonial-card blockquote {
          margin: 0;
          color: rgba(255,255,255,0.88);
          font-size: 16px;
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        .testimonial-card figcaption {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .testimonial-card figcaption strong {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
        }

        .testimonial-card figcaption span {
          color: rgba(255,255,255,0.48);
          font-size: 12px;
        }

        .deliverables-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .deliverables-grid--4 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 920px;
          margin-left: auto;
          margin-right: auto;
        }

        .deliverable-card {
          min-height: 250px;
          padding: 26px;
        }

        .deliverable-card .eyebrow,
        .pricing-card .eyebrow {
          color: rgba(223,122,254,0.86);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .deliverable-card h3,
        .pricing-card h3 {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .deliverable-card p,
        .pricing-card p {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .pricing-card {
          display: flex;
          min-height: 620px;
          flex-direction: column;
          padding: 28px;
        }

        .pricing-card.featured {
          border-color: rgba(132,104,235,0.45);
          background:
            radial-gradient(ellipse 100% 58% at 50% 100%, rgba(132,104,235,0.26), transparent 70%),
            rgba(255,255,255,0.055);
        }

        .pricing-price {
          margin-top: 18px;
          color: #ffffff;
          font-size: clamp(38px, 5vw, 54px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.95;
        }

        .pricing-list {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 12px;
          margin: 26px 0 28px;
          padding: 0;
          list-style: none;
        }

        .pricing-list li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          color: rgba(255,255,255,0.68);
          font-size: 14px;
          line-height: 1.5;
        }

        .pricing-list li::before {
          content: "";
          width: 8px;
          height: 8px;
          margin-top: 7px;
          border-radius: 999px;
          background: #8468EB;
        }

        .pricing-card .services-cta-primary,
        .pricing-card .services-cta-secondary {
          position: relative;
          z-index: 1;
          margin-top: auto;
          width: 100%;
        }

        .next-services-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            radial-gradient(ellipse 85% 70% at 50% 0%, rgba(132,104,235,0.26), transparent 72%),
            rgba(255,255,255,0.035);
          padding: clamp(28px, 5vw, 48px);
        }

        .next-services-panel::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 96px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.78), transparent);
        }

        .next-services-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
          gap: 16px;
          margin-top: 44px;
        }

        .next-service-card {
          display: flex;
          flex-direction: column;
          padding: 32px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(132,104,235,0.14), transparent 70%),
            rgba(255,255,255,0.04);
          text-decoration: none;
          transition: border-color 200ms ease, transform 200ms ease;
        }

        .next-service-card:hover {
          border-color: rgba(132,104,235,0.38);
          transform: translateY(-3px);
        }

        .next-service-card.primary {
          border-color: rgba(132,104,235,0.32);
          background:
            radial-gradient(ellipse 100% 62% at 50% 100%, rgba(132,104,235,0.26), transparent 70%),
            rgba(255,255,255,0.055);
        }

        .next-service-card.secondary {
          min-height: auto;
          opacity: 0.88;
        }

        .next-service-card:active {
          transform: scale(0.98) translateY(0);
          transition: transform 80ms ease;
        }

        .next-service-card:focus-visible {
          outline: 2px solid #C4B5FD;
          outline-offset: 3px;
        }

        .next-service-label {
          color: rgba(223,122,254,0.82);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .next-service-card h3 {
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .next-service-card p {
          margin-top: 10px;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.7;
        }

        .next-service-arrow {
          margin-top: auto;
          padding-top: 24px;
          color: #C4B5FD;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        @media (max-width: 980px) {
          .services-hero {
            min-height: auto;
            padding: 78px 0 88px;
          }

          .deliverables-grid,
          .deliverables-grid--4,
          .pricing-grid,
          .strategy-outcomes,
          .testimonials-grid,
          .next-services-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .services-shell {
            width: min(100% - 24px, 1180px);
          }

          .services-hero-title {
            font-size: clamp(44px, 16vw, 74px);
          }

          .services-section-title {
            font-size: clamp(30px, 11vw, 44px);
          }

          .services-cta-primary,
          .services-cta-secondary {
            width: 100%;
          }
        }
      ` }} />

      <ServiceHero
        label="Full AI Strategy Assessment"
        title="Get your AI stack roadmap."
        highlightedTitle="Built around how you work."
        body="A paid working session where we map your workflows and hand you the stack — the exact tools, the order to set them up, and what to ignore. No generic lists."
        primaryCta={{ label: "Book Your Strategy Session", href: strategyBookingHref }}
        variant="strategy"
        visual={<StackConstellation />}
        metrics={[
          { value: <CountUp value={120} suffix="+" />, label: "operators matched" },
          { value: <CountUp value={275} />, label: "AI tools reviewed" },
          { value: <CountUp value={4.9} decimals={1} suffix="/5" />, label: "session rating" },
        ]}
      />

      <section className="services-shell strategy-outcomes-section">
        <div className="strategy-outcomes" aria-label="Strategy assessment outcomes">
          {[
            {
              title: "Cut 40+ tools down to 5–7 essentials",
              body: "No more tab overload. Just the stack that fits your role and how you work.",
            },
            {
              title: "Know what to set up first",
              body: "A simple order of operations: what to configure now, what can wait, and what to ignore.",
            },
            {
              title: "Leave with a stack your team can execute",
              body: "Tools, integrations, setup notes — in writing, ready to hand off.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={120 + i * 90} className="strategy-outcome">
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="services-shell py-20 md:py-28">
        <SectionHeader
          label="What you get"
          title="A decision-ready AI stack, in writing."
          body="We turn your business into a stack. Not a generic list — a stack built for how you actually work."
        />
        <div className="deliverables-grid deliverables-grid--4">
          {deliverables.map((item, i) => (
            <Reveal key={item.title} delay={80 + i * 80}>
              <TiltCard className="services-card deliverable-card">
                <BlueprintDiagram type={deliverableDiagrams[i]} />
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="services-shell pb-4 md:pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="services-label">From operators who ran it</p>
          <h2 className="services-section-title">Less stack chaos. More execution.</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={80 + i * 90}>
              <TiltCard as="figure" className="testimonial-card" maxTilt={4}>
                <BeforeAfterStack compact />
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </figcaption>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="pricing" className="services-shell py-20 md:py-28">
        <SectionHeader
          label="Assessment tiers"
          title="Pricing matches your shape."
          body="More people = more workflows, handoffs, and adoption risk. Pick the tier that fits your team size and complexity."
        />
        <div className="pricing-grid">
          {tiers.map((tier, index) => {
            const ctaClass = index === 1 ? "services-cta-primary" : "services-cta-secondary";
            return (
              <Reveal key={tier.name} delay={80 + index * 100}>
                <TiltCard
                  className={`services-card pricing-card ${index === 1 ? "featured" : ""}`}
                  maxTilt={3}
                >
                  <p className="eyebrow">{index === 1 ? "Most common" : "Assessment"}</p>
                  <h3>{tier.name}</h3>
                  <div className="pricing-price">{tier.price}</div>
                  <p>{tier.description}</p>
                  <ul className="pricing-list">
                    {tier.scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link className={ctaClass} href={strategyBookingHref}>
                    Book Your Strategy Session
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

    </div>
  );
}
