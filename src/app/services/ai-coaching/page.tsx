import type { Metadata } from "next";
import { fetchAllTools } from "@/lib/catalog";
import CadenceSelector from "@/components/services/CadenceSelector";
import CountUp from "@/components/services/CountUp";
import OrbitalCore from "@/components/services/OrbitalCore";
import Reveal from "@/components/services/Reveal";
import ServiceHero from "@/components/services/ServiceHero";
import TiltCard from "@/components/services/TiltCard";
import ToolTicker from "@/components/services/ToolTicker";

export const metadata: Metadata = {
  title: "Fractional AI Lead | myAImatch",
  description:
    "Your fractional AI lead. We ride shotgun with your team — training, tool updates, and async support as your AI setup evolves.",
  openGraph: {
    title: "Fractional AI Lead | myAImatch",
    description:
      "Your fractional AI lead. We ride shotgun with your team — training, tool updates, and async support as your AI setup evolves.",
    url: "https://myaimatch.ai/services/ai-coaching",
    type: "website",
  },
};

const included = [
  {
    eyebrow: "01",
    title: "Your AI sparring partner",
    body: "Weekly or monthly calls where we test workflows, break things, and ship better ones together.",
  },
  {
    eyebrow: "02",
    title: "Team rollouts",
    body: "We onboard new hires and train existing team on your AI setup — at their pace, with real examples from your business.",
  },
  {
    eyebrow: "03",
    title: "New tools, vetted for you",
    body: "We test 10–20 new AI tools a month. You only hear about the 2 worth your time.",
  },
  {
    eyebrow: "04",
    title: "Slack or WhatsApp access",
    body: "Async questions answered between calls. No ticket queues, no waiting a week for a reply.",
  },
];

const testimonials = [
  {
    quote: "Having them on Slack is like having an AI hire without the headcount. Best ROI decision I made this year.",
    name: "Elena Vargas",
    role: "Founder, Tidewater Co.",
  },
  {
    quote: "Every month they show me 2 tools I'd never have found. Half of them replace something older in our AI setup.",
    name: "Devon Park",
    role: "COO, Northpoint Group",
  },
  {
    quote: "Our team went from scared of AI to building their own workflows in 8 weeks.",
    name: "Sam Hoffman",
    role: "People Lead, Bright Labs",
  },
];

const calHref = process.env.NEXT_PUBLIC_CAL_COACHING_URL || "#book";

async function getTickerTools() {
  try {
    const tools = await fetchAllTools();
    return tools
      .filter((tool) => tool.name)
      .slice(0, 10)
      .map((tool) => tool.name);
  } catch {
    return [];
  }
}

export default async function CoachingPage() {
  const tickerTools = await getTickerTools();

  return (
    <div className="coaching-page bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .coaching-page {
          --service-primary: #8468EB;
          --service-accent: #C4B5FD;
          --service-surface: rgba(255,255,255,0.04);
          --service-border: rgba(255,255,255,0.08);
          --service-muted: rgba(255,255,255,0.6);
          background-color: #111111;
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
          background: linear-gradient(135deg, #8468EB, #5B42C3);
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
          outline: 2px solid #C4B5FD;
          outline-offset: 3px;
        }

        .coaching-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--service-border);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(132,104,235,0.18), transparent 70%),
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
          background: radial-gradient(ellipse, rgba(132,104,235,0.48), transparent 70%);
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
            linear-gradient(180deg, rgba(132,104,235,0.18), transparent 34%),
            radial-gradient(ellipse 72% 42% at 50% 14%, rgba(132,104,235,0.34), transparent 68%),
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
          background: linear-gradient(135deg, #ffffff 8%, #C4B5FD 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .coaching-metrics {
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
        }

        .coaching-metrics strong {
          color: #ffffff;
          font-weight: 700;
          margin-right: 6px;
        }

        .coaching-metrics-divider {
          color: rgba(255,255,255,0.24);
        }

        .coaching-testimonials {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 44px;
        }

        .coaching-testimonial-card {
          margin: 0;
          padding: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(132,104,235,0.12), transparent 70%),
            rgba(255,255,255,0.035);
        }

        .coaching-testimonial-card blockquote {
          margin: 0;
          color: rgba(255,255,255,0.88);
          font-size: 16px;
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        .coaching-testimonial-card figcaption {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .coaching-testimonial-card figcaption strong {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
        }

        .coaching-testimonial-card figcaption span {
          color: rgba(255,255,255,0.48);
          font-size: 12px;
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
            linear-gradient(180deg, rgba(132,104,235,0.14), rgba(132,104,235,0.04) 44%, transparent),
            radial-gradient(ellipse 70% 58% at 50% 0%, rgba(132,104,235,0.32), transparent 70%),
            #111111;
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
          background: linear-gradient(180deg, #C4B5FD, transparent);
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
          border: 1px solid rgba(132,104,235,0.22);
          border-radius: 18px;
          background:
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(132,104,235,0.16), transparent 70%),
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
          .coaching-grid,
          .coaching-testimonials {
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
      ` }} />

      <ServiceHero
        label="Fractional AI Lead"
        title="Keep your AI setup current."
        highlightedTitle="Without hiring full-time."
        body="An embedded AI lead for your team — calls, async support, team training, and monthly tool curation. Without the full-time hire."
        primaryCta={{ label: "Book a Discovery Call", href: calHref }}
        variant="lead"
        visual={<OrbitalCore />}
        metrics={[
          { value: <CountUp value={60} suffix="+" />, label: "teams supported" },
          { value: <CountUp value={200} suffix="+" />, label: "AI tools tested monthly" },
          { value: <CountUp value={4.9} decimals={1} suffix="/5" />, label: "client rating" },
        ]}
      />

      <ToolTicker tools={tickerTools} />

      <section id="whats-included" className="coaching-shell py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="coaching-label">What&apos;s included</p>
          <h2 className="coaching-section-title">Your fractional AI team.</h2>
          <p className="coaching-section-body">
            We don&apos;t hand off your AI setup and disappear. We stay embedded — so your team actually uses it, and you never fall behind the tools.
          </p>
        </div>
        <div className="coaching-grid">
          {included.map((item, i) => (
            <Reveal key={item.title} delay={80 + i * 80}>
              <TiltCard className="coaching-card coaching-item">
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="coaching-shell pb-4 md:pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="coaching-label">From teams we ride with</p>
          <h2 className="coaching-section-title">Embedded, not outsourced.</h2>
        </div>
        <div className="coaching-testimonials">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={80 + i * 90}>
              <TiltCard as="figure" className="coaching-testimonial-card" maxTilt={4}>
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

      <CadenceSelector ctaHref={calHref} />
    </div>
  );
}
