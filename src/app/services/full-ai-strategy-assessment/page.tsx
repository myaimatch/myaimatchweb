import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full AI Strategy Assessment | myAIMatch",
  description:
    "We analyze how your business actually runs, identify what's missing, and design an AI stack you can implement immediately.",
  openGraph: {
    title: "Full AI Strategy Assessment | myAIMatch",
    description:
      "We analyze how your business actually runs, identify what's missing, and design an AI stack you can implement immediately.",
    url: "https://myaimatch.ai/services/full-ai-strategy-assessment",
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
    body: "A focused 1:1 session to break down your workflow and define exactly what needs to change.",
  },
  {
    eyebrow: "02",
    title: "Workflow and tool-stack review",
    body: "We analyze your current tools, team, and workflows to identify what's slowing you down.",
  },
  {
    eyebrow: "03",
    title: "Recommended AI tools by use case",
    body: "A stack matched to your actual workflows, not a generic list.",
  },
  {
    eyebrow: "04",
    title: "Integration roadmap",
    body: "Exactly what to connect, automate, and prioritize — and in what order.",
  },
  {
    eyebrow: "05",
    title: "Priority action plan",
    body: "A clear step-by-step plan so you know what to implement first, next, and later.",
  },
  {
    eyebrow: "06",
    title: "Branded report and recording",
    body: "Delivered within 48 hours. Yours to revisit anytime.",
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

export default function StrategyAssessmentPage() {
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
          background-color: #000000;
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

        .services-cta-primary:active,
        .services-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .services-cta-primary:focus-visible,
        .services-cta-secondary:focus-visible {
          outline: 2px solid #df7afe;
          outline-offset: 3px;
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

        .map-card-one { left: 0; top: 12px; }
        .map-card-two { right: 0; top: 104px; }
        .map-card-three { left: 12%; bottom: 0; }

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

        .next-services-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(129,74,200,0.14), transparent 70%),
            rgba(255,255,255,0.04);
          text-decoration: none;
          transition: border-color 200ms ease, transform 200ms ease;
        }

        .next-service-card:hover {
          border-color: rgba(129,74,200,0.38);
          transform: translateY(-3px);
        }

        .next-service-card:active {
          transform: scale(0.98) translateY(0);
          transition: transform 80ms ease;
        }

        .next-service-card:focus-visible {
          outline: 2px solid #df7afe;
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
          color: #df7afe;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
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
            left: auto; right: auto; top: auto; bottom: auto;
            width: 100%;
          }

          .deliverables-grid,
          .pricing-grid,
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
      `}</style>

      <section className="services-hero">
        <div className="services-shell relative z-10 text-center">
          <p className="services-label">Full AI Strategy Assessment</p>
          <h1 className="services-hero-title">
            Build the AI stack <span>you&apos;ll actually use.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.75] text-white/65 md:text-lg">
            We analyze how your business actually runs, identify what&apos;s missing, and design an AI stack you can implement immediately.
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
              <strong><span>Workflow</span> review</strong>
              <p>Where your work slows down and where AI fits.</p>
            </div>
            <div className="map-card map-card-two">
              <strong><span>AI Match</span> logic</strong>
              <p>Filtered by fit, budget, and setup effort — not by trend.</p>
            </div>
            <div className="map-card map-card-three">
              <strong><span>Implementation</span> order</strong>
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
          body="Built around your workflow — not around whatever's trending."
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

      <section id="pricing" className="services-shell py-20 md:py-28">
        <SectionHeader
          label="Assessment tiers"
          title="Choose what best describes you."
          body="Scope determines depth. Price reflects the workflows, roles, and integrations that need reviewing."
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

      <section className="services-shell pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="services-label">Where do you want to go next?</p>
          <h2 className="services-section-title">Ready to take the next step?</h2>
          <p className="services-section-body">
            The roadmap is yours to keep. If you want support executing it, here&apos;s how we continue.
          </p>
        </div>
        <div className="next-services-grid">
          <Link href="/services/ai-tech-stack-implementation" className="next-service-card">
            <p className="next-service-label">Next step</p>
            <h3>AI Tech Stack Implementation</h3>
            <p>We configure your tools, connect workflows, and build the automations from your roadmap.</p>
            <p className="next-service-arrow">Explore Implementation →</p>
          </Link>
          <Link href="/services/ai-coaching" className="next-service-card">
            <p className="next-service-label">Ongoing</p>
            <h3>AI Coaching</h3>
            <p>Ongoing training so you and your team know exactly how to use what we&apos;ve built.</p>
            <p className="next-service-arrow">Explore AI Coaching →</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
