import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tech Stack Implementation | myAIMatch",
  description:
    "We configure your tools, connect your workflows, and build the automations — so your AI stack works from day one.",
  openGraph: {
    title: "AI Tech Stack Implementation | myAIMatch",
    description:
      "We configure your tools, connect your workflows, and build the automations — so your AI stack works from day one.",
    url: "https://myaimatch.ai/services/ai-tech-stack-implementation",
    type: "website",
  },
};

const deliverables = [
  {
    eyebrow: "01",
    title: "Tool configuration & setup",
    body: "Every tool from your roadmap installed, connected, and configured for your workflow.",
  },
  {
    eyebrow: "02",
    title: "Workflow automation",
    body: "We build the automations so your stack works without constant manual input.",
  },
  {
    eyebrow: "03",
    title: "API & integration setup",
    body: "Tools that talk to each other. No broken handoffs.",
  },
  {
    eyebrow: "04",
    title: "Handoff documentation",
    body: "Clear instructions so your team knows exactly how everything works.",
  },
];

const calHref = process.env.NEXT_PUBLIC_CAL_IMPLEMENTATION_URL || "#book";

export default function ImplementationPage() {
  return (
    <div className="impl-page bg-black text-white">
      <style>{`
        .impl-page {
          --service-primary: #814ac8;
          --service-accent: #df7afe;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          background-color: #000000;
          color: #ffffff;
          overflow: hidden;
        }

        .impl-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .impl-label {
          margin-bottom: 14px;
          color: var(--service-primary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .impl-section-title {
          color: #ffffff;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .impl-section-body {
          margin-top: 18px;
          color: var(--service-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .impl-cta-primary,
        .impl-cta-secondary {
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
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .impl-cta-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #814ac8, #a066d4);
          border: 1px solid rgba(223,122,254,0.32);
        }

        .impl-cta-secondary {
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .impl-cta-primary:hover,
        .impl-cta-secondary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        .impl-cta-primary:active,
        .impl-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .impl-cta-primary:focus-visible,
        .impl-cta-secondary:focus-visible {
          outline: 2px solid #df7afe;
          outline-offset: 3px;
        }

        .impl-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--service-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(129,74,200,0.18), transparent 70%),
            var(--service-surface);
        }

        .impl-card::after {
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

        .impl-card:hover::after {
          opacity: 0.48;
          transform: translateX(-50%) scale(1.08);
        }

        .impl-hero {
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

        .impl-hero::before {
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

        .impl-hero::after {
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

        .impl-hero-title {
          margin: 0 auto;
          max-width: 920px;
          color: #ffffff;
          font-size: clamp(48px, 9vw, 112px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.93;
        }

        .impl-hero-title span {
          background: linear-gradient(135deg, #ffffff 8%, #df7afe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .impl-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .impl-deliverable {
          min-height: 220px;
          padding: 26px;
        }

        .impl-deliverable .eyebrow {
          color: rgba(223,122,254,0.86);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .impl-deliverable h3 {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .impl-deliverable p {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .impl-who {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(129,74,200,0.14), rgba(129,74,200,0.04) 44%, transparent),
            radial-gradient(ellipse 70% 58% at 50% 0%, rgba(129,74,200,0.32), transparent 70%),
            #0d0d0d;
          padding: clamp(48px, 6vw, 80px) 24px;
          text-align: center;
        }

        .impl-who::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 80px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #df7afe, transparent);
        }

        .impl-who h2 {
          position: relative;
          margin: 0 auto;
          max-width: 680px;
          color: #ffffff;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
        }

        .impl-who p {
          position: relative;
          margin: 18px auto 0;
          max-width: 560px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        .impl-funnel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(129,74,200,0.22);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(129,74,200,0.16), transparent 70%),
            rgba(255,255,255,0.035);
          padding: 40px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .impl-funnel-text h3 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .impl-funnel-text p {
          margin-top: 8px;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.7;
          max-width: 480px;
        }

        @media (max-width: 980px) {
          .impl-hero {
            min-height: auto;
            padding: 78px 0 88px;
          }
          .impl-grid {
            grid-template-columns: 1fr;
          }
          .impl-funnel {
            flex-direction: column;
            text-align: center;
          }
          .impl-funnel-text p {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .impl-shell {
            width: min(100% - 24px, 1180px);
          }
          .impl-hero-title {
            font-size: clamp(44px, 16vw, 74px);
          }
          .impl-cta-primary,
          .impl-cta-secondary {
            width: 100%;
          }
        }
      `}</style>

      <section className="impl-hero">
        <div className="impl-shell relative z-10 text-center">
          <p className="impl-label">AI Tech Stack Implementation</p>
          <h1 className="impl-hero-title">
            Your roadmap is ready. <span>Now let&apos;s build it.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.75] text-white/65 md:text-lg">
            We configure your tools, connect your workflows, and build the automations — so your AI stack works from day one.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="impl-cta-primary" href={calHref}>
              Book an Implementation Call
            </Link>
            <Link className="impl-cta-secondary" href="#what-we-build">
              See what&apos;s included
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/40">
            For teams who already know what they want to build.
          </p>
        </div>
      </section>

      <section id="what-we-build" className="impl-shell py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="impl-label">What we build</p>
          <h2 className="impl-section-title">Your AI stack, fully operational.</h2>
          <p className="impl-section-body">
            We take your strategy roadmap and handle the entire technical setup — so you can start using your stack, not configuring it.
          </p>
        </div>
        <div className="impl-grid">
          {deliverables.map((item) => (
            <article className="impl-card impl-deliverable" key={item.title}>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="impl-shell pb-20 md:pb-28">
        <div className="impl-who">
          <h2>Best after a Full AI Strategy Assessment.</h2>
          <p>
            Bring your roadmap — we&apos;ll handle the build. No strategy yet? Start with the assessment first.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="impl-cta-primary" href={calHref}>
              Book your implementation call
            </Link>
            <Link className="impl-cta-secondary" href="/services/full-ai-strategy-assessment">
              Start with Strategy Assessment
            </Link>
          </div>
        </div>
      </section>

      <section className="impl-shell pb-20 md:pb-28">
        <div className="impl-funnel">
          <div className="impl-funnel-text">
            <h3>After implementation, stay sharp.</h3>
            <p>
              AI Coaching keeps your team trained and your stack current as tools evolve.
            </p>
          </div>
          <Link className="impl-cta-primary" href="/services/ai-coaching" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
            Explore AI Coaching →
          </Link>
        </div>
      </section>
    </div>
  );
}
