import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Tech Stack Strategy Assessment | myAIMatch",
  description:
    "We review your workflow, team, and goals — then build a personalized AI stack plan you can actually implement.",
  openGraph: {
    title: "Full Tech Stack Strategy Assessment | myAIMatch",
    description:
      "We review your workflow, team, and goals — then build a personalized AI stack plan you can actually implement.",
    url: "https://myaimatch.ai/services",
    type: "website",
  },
};

type Tier = {
  name: string;
  price: string;
  description: string;
  scope: string[];
  href?: string;
};

const deliverables = [
  {
    eyebrow: "01",
    title: "60-minute 1:1 strategy session",
    body: "A focused video call to map your stack, decisions, and next moves.",
  },
  {
    eyebrow: "02",
    title: "Workflow and tool-stack review",
    body: "Pre-session audit of your tools, team structure, and friction points.",
  },
  {
    eyebrow: "03",
    title: "Recommended AI tools by use case",
    body: "A stack matched to your actual workflows — not a generic list.",
  },
  {
    eyebrow: "04",
    title: "Integration roadmap",
    body: "What connects, what should be automated, and in what order.",
  },
  {
    eyebrow: "05",
    title: "Priority action plan",
    body: "A clear first, second, third — based on impact and effort.",
  },
  {
    eyebrow: "06",
    title: "Branded report and recording",
    body: "Delivered within 48 hours. Yours to revisit anytime.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Choose your assessment tier",
    body: "Pick the scope that matches your complexity: Solo, Small Team, or SMB.",
    detail: "Payment first, then scheduling.",
  },
  {
    step: "02",
    title: "Share your current workflow",
    body: "Complete a short questionnaire about your tools, tasks, and goals.",
    detail: "This gives the session real context.",
  },
  {
    step: "03",
    title: "Meet for your strategy session",
    body: "60 minutes on workflow pain points, tool fit, and priority tradeoffs.",
    detail: "By video call.",
  },
  {
    step: "04",
    title: "Get your AI stack roadmap",
    body: "PDF report, implementation order, and next-step options within 48 hours.",
    detail: "Optional check-in after 7 days.",
  },
];

const nextSteps = [
  {
    title: "AI Tech Stack Implementation",
    body: "We configure your tools, connect workflows, and build the automations from your roadmap.",
  },
  {
    title: "AI Coaching",
    body: "Training on how your stack works — for you and your team, at your own pace.",
  },
];

const principles = [
  {
    title: "Fit before features",
    body: "A tool only matters if it fits your role, budget, and actual work.",
  },
  {
    title: "Workflow before tool choice",
    body: "We start with how work happens now, then match tools to the gaps.",
  },
  {
    title: "Implementation before hype",
    body: "You leave with a priority order and a clear path to adoption.",
  },
];

const tiers: Tier[] = [
  {
    name: "Solo / Freelancer",
    price: "$2,000",
    description: "One operator. One main workflow. Clear tool recommendations and setup order.",
    scope: ["1 primary workflow", "Recommended tools by use case", "Priority setup order"],
    href: process.env.NEXT_PUBLIC_STRATEGY_SOLO_STRIPE_URL,
  },
  {
    name: "Small Team",
    price: "$5,000",
    description: "For teams with shared workflows, multiple roles, or a few tools already in motion.",
    scope: ["Multiple roles or workflows", "Integration roadmap", "Team adoption notes"],
    href: process.env.NEXT_PUBLIC_STRATEGY_TEAM_STRIPE_URL,
  },
  {
    name: "SMB",
    price: "$10,000",
    description: "Cross-team review, deeper prioritization, and phased implementation.",
    scope: ["Cross-team workflow review", "ROI estimate ranges", "Implementation phasing"],
    href: process.env.NEXT_PUBLIC_STRATEGY_SMB_STRIPE_URL,
  },
];

function getTierHref(href?: string) {
  return href || "#pricing";
}

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

export default function ServicesPage() {
  const heroPrimaryHref = tiers.find((tier) => tier.href)?.href || "#pricing";

  return (
    <div className="services-page bg-black text-white">
      <style>{`
        .services-page {
          --service-primary: #814ac8;
          --service-accent: #df7afe;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          --service-dim: rgba(255,255,255,0.4);
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
          background: linear-gradient(135deg, #814ac8, #a066d4);
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

        .services-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--service-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(129,74,200,0.18), transparent 70%),
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
          background: radial-gradient(ellipse, rgba(129,74,200,0.48), transparent 70%);
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
            linear-gradient(180deg, rgba(129,74,200,0.18), transparent 34%),
            radial-gradient(ellipse 72% 42% at 50% 14%, rgba(129,74,200,0.34), transparent 68%),
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
          background: linear-gradient(135deg, #ffffff 8%, #df7afe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .services-map {
          position: relative;
          margin: 58px auto 0;
          width: min(820px, 100%);
          min-height: 300px;
        }

        .services-map::before {
          content: "";
          position: absolute;
          inset: 18px 10%;
          border: 1px solid rgba(129,74,200,0.18);
          border-radius: 999px;
        }

        .services-map::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(129,74,200,0.55), transparent);
        }

        .map-card {
          position: absolute;
          width: min(290px, 42%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          background: rgba(13,13,13,0.86);
          padding: 20px;
          backdrop-filter: blur(12px);
          z-index: 1;
        }

        .map-card strong {
          display: block;
          margin-bottom: 8px;
          color: #ffffff;
          font-size: 16px;
          letter-spacing: -0.01em;
        }

        .map-card p {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          line-height: 1.6;
        }

        .map-card span {
          color: #df7afe;
        }

        .map-card-one {
          left: 0;
          top: 12px;
        }

        .map-card-two {
          right: 0;
          top: 104px;
        }

        .map-card-three {
          left: 12%;
          bottom: 0;
        }

        .map-node {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 2;
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,74,200,0.34);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at center, rgba(129,74,200,0.42), rgba(13,13,13,0.94) 62%),
            #0d0d0d;
        }

        .deliverables-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
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
        .pricing-card h3,
        .principle-card h3 {
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
        .pricing-card p,
        .principle-card p {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .process-section {
          position: relative;
          background:
            radial-gradient(ellipse 70% 42% at 76% 10%, rgba(129,74,200,0.18), transparent 72%),
            #0d0d0d;
        }

        .process-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 56px;
          align-items: start;
        }

        .process-list {
          position: relative;
          display: grid;
          gap: 18px;
        }

        .process-list::before {
          content: "";
          position: absolute;
          left: 23px;
          top: 32px;
          bottom: 32px;
          width: 1px;
          background: linear-gradient(180deg, rgba(129,74,200,0.6), rgba(129,74,200,0.08));
        }

        .process-item {
          position: relative;
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 18px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
        }

        .process-number {
          position: relative;
          z-index: 1;
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(135deg, #814ac8, #a066d4);
          font-size: 13px;
          font-weight: 800;
        }

        .process-item h3 {
          color: #ffffff;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .process-item p {
          margin-top: 8px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.65;
        }

        .process-item small {
          display: block;
          margin-top: 14px;
          color: rgba(223,122,254,0.8);
          font-size: 12px;
          line-height: 1.5;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .pricing-card {
          display: flex;
          min-height: 500px;
          flex-direction: column;
          padding: 28px;
        }

        .pricing-card.featured {
          border-color: rgba(129,74,200,0.45);
          background:
            radial-gradient(ellipse 100% 58% at 50% 100%, rgba(129,74,200,0.26), transparent 70%),
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
          background: #814ac8;
        }

        .pricing-card .services-cta-primary,
        .pricing-card .services-cta-secondary {
          position: relative;
          z-index: 1;
          margin-top: auto;
          width: 100%;
        }

        .next-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 50px;
          align-items: center;
        }

        .next-stack {
          display: grid;
          gap: 16px;
        }

        .next-card {
          display: grid;
          grid-template-columns: 54px 1fr;
          gap: 18px;
          align-items: center;
          padding: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
        }

        .next-card-number {
          display: grid;
          width: 54px;
          height: 54px;
          place-items: center;
          border-radius: 999px;
          color: #df7afe;
          background: rgba(129,74,200,0.14);
          border: 1px solid rgba(129,74,200,0.26);
          font-weight: 800;
        }

        .next-card h3 {
          color: #ffffff;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .next-card p {
          margin-top: 6px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.65;
        }

        .principles-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .principle-card {
          padding: 30px;
        }

        .principle-card h3 {
          margin-top: 0;
          font-size: 24px;
        }

        .final-cta {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(129,74,200,0.26), rgba(129,74,200,0.08) 44%, transparent),
            radial-gradient(ellipse 85% 58% at 50% 0%, rgba(129,74,200,0.45), transparent 70%),
            #0d0d0d;
          padding: clamp(48px, 8vw, 92px) 24px;
          text-align: center;
        }

        .final-cta::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 96px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #df7afe, transparent);
        }

        .final-cta h2 {
          position: relative;
          margin: 0 auto;
          max-width: 840px;
          color: #ffffff;
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.98;
        }

        .final-cta p {
          position: relative;
          margin: 22px auto 0;
          max-width: 620px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        @media (max-width: 980px) {
          .services-hero {
            min-height: auto;
            padding: 78px 0 88px;
          }

          .services-map {
            min-height: auto;
            display: grid;
            gap: 14px;
          }

          .services-map::before,
          .services-map::after,
          .map-node {
            display: none;
          }

          .map-card {
            position: relative;
            left: auto;
            right: auto;
            top: auto;
            bottom: auto;
            width: 100%;
          }

          .deliverables-grid,
          .pricing-grid,
          .principles-grid,
          .process-grid,
          .next-grid {
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

          .process-item,
          .next-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="services-hero">
        <div className="services-shell relative z-10 text-center">
          <p className="services-label">Full Tech Stack Strategy Assessment</p>
          <h1 className="services-hero-title">
            Build the AI stack <span>you&apos;ll actually use.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.75] text-white/65 md:text-lg">
            We review your workflow, team, and goals — then build a personalized AI stack plan you can actually implement.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="services-cta-primary" href={heroPrimaryHref}>
              Start Your Strategy Assessment
            </Link>
            <Link className="services-cta-secondary" href="/assessment">
              Try the AI Match Engine - Free
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/40">
            For founders, freelancers, and teams ready to stop guessing and start building.
          </p>

          <div className="services-map" aria-hidden="true">
            <div className="map-card map-card-one">
              <strong>
                <span>Workflow</span> review
              </strong>
              <p>Where your work slows down and where AI fits.</p>
            </div>
            <div className="map-card map-card-two">
              <strong>
                <span>AI Match</span> logic
              </strong>
              <p>Filtered by fit, budget, and setup effort — not by trend.</p>
            </div>
            <div className="map-card map-card-three">
              <strong>
                <span>Implementation</span> order
              </strong>
              <p>Leave knowing exactly what to set up first.</p>
            </div>
            <div className="map-node">
              <Image src="/logo.png" alt="" width={42} height={42} />
            </div>
          </div>
        </div>
      </section>

      <section className="services-shell py-20 md:py-28">
        <SectionHeader
          label="What you get"
          title="A decision-ready AI stack roadmap."
          body="Built around your workflow — not around whatever tool is trending this week."
        />
        <div className="deliverables-grid">
          {deliverables.map((item) => (
            <article className="services-card deliverable-card" key={item.title}>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section py-20 md:py-28">
        <div className="services-shell process-grid">
          <div className="sticky top-24">
            <SectionHeader
              align="left"
              label="How it works"
              title="Pay. Prep. Strategy. Roadmap."
              body="Context first. Then we make decisions together on the call."
            />
          </div>
          <div className="process-list">
            {processSteps.map((item) => (
              <article className="process-item" key={item.step}>
                <div className="process-number">{item.step}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <small>{item.detail}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="services-shell py-20 md:py-28">
        <SectionHeader
          label="Assessment tiers"
          title="Choose the scope that matches your complexity."
          body="Scope determines depth. More complexity means more workflows, roles, and integration decisions to untangle."
        />
        <div className="pricing-grid">
          {tiers.map((tier, index) => {
            const ctaClass = index === 1 ? "services-cta-primary" : "services-cta-secondary";

            return (
              <article
                className={`services-card pricing-card ${index === 1 ? "featured" : ""}`}
                key={tier.name}
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
                <Link className={ctaClass} href={getTierHref(tier.href)}>
                  Start Assessment
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-shell py-20 md:py-28">
        <div className="next-grid">
          <div>
            <SectionHeader
              align="left"
              label="After the assessment"
              title="Want help executing the plan?"
              body="The assessment stands on its own. If you want to go further, MyAIMatch offers hands-on implementation and coaching."
            />
          </div>
          <div className="next-stack">
            {nextSteps.map((item, index) => (
              <article className="next-card" key={item.title}>
                <div className="next-card-number">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-shell py-20 md:py-28">
        <SectionHeader
          label="Why MyAIMatch"
          title="Right AI first. Better implementation second."
          body="Built around fit, workflow, and adoption — not around what's popular."
        />
        <div className="principles-grid">
          {principles.map((item) => (
            <article className="services-card principle-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-shell pb-20 md:pb-28">
        <div className="final-cta">
          <h2>Leave the session with a plan, not another list of tools.</h2>
          <p>
            Start with your workflow. Leave with clarity.
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="services-cta-primary" href={heroPrimaryHref}>
              Start Your Strategy Assessment
            </Link>
            <Link className="services-cta-secondary" href="/assessment">
              Try the AI Match Engine - Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
