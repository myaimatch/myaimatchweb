import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coaching | myAIMatch",
  description:
    "Regular sessions, hands-on training, and ongoing support — so your team actually uses what you've built.",
  openGraph: {
    title: "AI Coaching | myAIMatch",
    description:
      "Regular sessions, hands-on training, and ongoing support — so your team actually uses what you've built.",
    url: "https://myaimatch.ai/services/ai-coaching",
    type: "website",
  },
};

const included = [
  {
    eyebrow: "01",
    title: "1:1 sessions",
    body: "Regular calls focused on how you use your tools day-to-day.",
  },
  {
    eyebrow: "02",
    title: "Team training",
    body: "We teach your team the stack — at their pace, with real examples.",
  },
  {
    eyebrow: "03",
    title: "Tool updates & new additions",
    body: "As AI evolves, we keep your stack current and introduce better tools when they matter.",
  },
  {
    eyebrow: "04",
    title: "Ongoing support",
    body: "Questions between sessions answered. No waiting until the next call.",
  },
];

const calHref = process.env.NEXT_PUBLIC_CAL_COACHING_URL || "#book";

export default function CoachingPage() {
  return (
    <div className="coaching-page bg-black text-white">
      <style>{`
        .coaching-page {
          --service-primary: #814ac8;
          --service-accent: #df7afe;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          background-color: #000000;
          color: #ffffff;
          overflow: hidden;
        }

        .coaching-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .coaching-label {
          margin-bottom: 14px;
          color: var(--service-primary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .coaching-section-title {
          color: #ffffff;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .coaching-section-body {
          margin-top: 18px;
          color: var(--service-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .coaching-cta-primary,
        .coaching-cta-secondary {
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

        .coaching-cta-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #814ac8, #a066d4);
          border: 1px solid rgba(223,122,254,0.32);
        }

        .coaching-cta-secondary {
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .coaching-cta-primary:hover,
        .coaching-cta-secondary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        .coaching-cta-primary:active,
        .coaching-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .coaching-cta-primary:focus-visible,
        .coaching-cta-secondary:focus-visible {
          outline: 2px solid #df7afe;
          outline-offset: 3px;
        }

        .coaching-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--service-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(129,74,200,0.18), transparent 70%),
            var(--service-surface);
        }

        .coaching-card::after {
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

        .coaching-card:hover::after {
          opacity: 0.48;
          transform: translateX(-50%) scale(1.08);
        }

        .coaching-hero {
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

        .coaching-hero::before {
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

        .coaching-hero::after {
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

        .coaching-hero-title {
          margin: 0 auto;
          max-width: 920px;
          color: #ffffff;
          font-size: clamp(48px, 9vw, 112px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.93;
        }

        .coaching-hero-title span {
          background: linear-gradient(135deg, #ffffff 8%, #df7afe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .coaching-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .coaching-item {
          min-height: 220px;
          padding: 26px;
        }

        .coaching-item .eyebrow {
          color: rgba(223,122,254,0.86);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .coaching-item h3 {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .coaching-item p {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .coaching-who {
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

        .coaching-who::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 80px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #df7afe, transparent);
        }

        .coaching-who h2 {
          position: relative;
          margin: 0 auto;
          max-width: 680px;
          color: #ffffff;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
        }

        .coaching-who p {
          position: relative;
          margin: 18px auto 0;
          max-width: 560px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        .coaching-funnel {
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

        .coaching-funnel-text h3 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .coaching-funnel-text p {
          margin-top: 8px;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.7;
          max-width: 480px;
        }

        @media (max-width: 980px) {
          .coaching-hero {
            min-height: auto;
            padding: 78px 0 88px;
          }
          .coaching-grid {
            grid-template-columns: 1fr;
          }
          .coaching-funnel {
            flex-direction: column;
            text-align: center;
          }
          .coaching-funnel-text p {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .coaching-shell {
            width: min(100% - 24px, 1180px);
          }
          .coaching-hero-title {
            font-size: clamp(44px, 16vw, 74px);
          }
          .coaching-cta-primary,
          .coaching-cta-secondary {
            width: 100%;
          }
        }
      `}</style>

      <section className="coaching-hero">
        <div className="coaching-shell relative z-10 text-center">
          <p className="coaching-label">AI Coaching</p>
          <h1 className="coaching-hero-title">
            Keep your team <span>ahead of the tools.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.75] text-white/65 md:text-lg">
            Regular sessions, hands-on training, and ongoing support — so your team actually uses what you&apos;ve built.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="coaching-cta-primary" href={calHref}>
              Book a Coaching Call
            </Link>
            <Link className="coaching-cta-secondary" href="#whats-included">
              See what&apos;s included
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/40">
            For individuals, founders, and teams already running an AI stack.
          </p>
        </div>
      </section>

      <section id="whats-included" className="coaching-shell py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="coaching-label">What&apos;s included</p>
          <h2 className="coaching-section-title">Training that sticks.</h2>
          <p className="coaching-section-body">
            We don&apos;t just hand off your stack and disappear. We stay with you — so your team actually uses it.
          </p>
        </div>
        <div className="coaching-grid">
          {included.map((item) => (
            <article className="coaching-card coaching-item" key={item.title}>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="coaching-shell pb-20 md:pb-28">
        <div className="coaching-who">
          <h2>You have the tools. Now let&apos;s make sure everyone uses them.</h2>
          <p>
            Ideal after AI Tech Stack Implementation. We stay with your team through every phase of adoption.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="coaching-cta-primary" href={calHref}>
              Book your coaching call
            </Link>
            <Link className="coaching-cta-secondary" href="/services/ai-tech-stack-implementation">
              Start with Implementation
            </Link>
          </div>
        </div>
      </section>

      <section className="coaching-shell pb-20 md:pb-28">
        <div className="coaching-funnel">
          <div className="coaching-funnel-text">
            <h3>New to AI tools? Start here.</h3>
            <p>
              Use the free AI Match Engine to discover what tools fit your workflow before committing.
            </p>
          </div>
          <Link className="coaching-cta-primary" href="/assessment" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
            Try the AI Match Engine — Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
