import Link from "next/link";
import type { Metadata } from "next";
import HomepageConstellation from "@/components/HomepageConstellation";
import DirectoryClient from "@/components/DirectoryClient";
import { fetchAllCategories, fetchAllTools } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "myAIMatch - Find AI Tools You'll Actually Use",
  description:
    "Use the AI Match Engine to get AI tool recommendations for your workflow, team, budget, and implementation goals.",
  openGraph: {
    title: "myAIMatch - Find AI Tools You'll Actually Use",
    description:
      "Use the AI Match Engine to get AI tool recommendations for your workflow, team, budget, and implementation goals.",
    url: "https://myaimatch.ai",
    type: "website",
  },
};


export default async function HomePage() {
  const [tools, categories] = await Promise.all([fetchAllTools(), fetchAllCategories()]);

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name;
  }

  return (
    <div className="home-ramp bg-black text-white">
      <style>{`
        .home-ramp {
          --home-primary: #814ac8;
          --home-accent: #df7afe;
          --home-card: rgba(255,255,255,0.04);
          --home-border: rgba(255,255,255,0.08);
          --home-muted: rgba(255,255,255,0.6);
          --home-dim: rgba(255,255,255,0.4);
          overflow: hidden;
        }

        .home-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .home-label {
          color: var(--home-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .home-hero {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 36px 0 64px;
          background:
            radial-gradient(ellipse 80% 54% at 50% 0%, rgba(129,74,200,0.42), transparent 68%),
            radial-gradient(ellipse 56% 44% at 78% 34%, rgba(223,122,254,0.14), transparent 68%),
            radial-gradient(ellipse 40% 30% at 12% 82%, rgba(129,74,200,0.08), transparent 60%),
            #000000;
        }

        .home-hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          opacity: 0.032;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        .home-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 82px 82px;
          mask-image: radial-gradient(ellipse 72% 58% at 50% 16%, black, transparent 76%);
          pointer-events: none;
        }

        .home-hero::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 170px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.72), transparent);
          pointer-events: none;
        }

        .home-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 0.86fr);
          gap: 34px;
          align-items: center;
        }

        .home-hero-copy {
          padding: 44px 0;
        }

        .home-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.68);
          font-size: 12px;
          line-height: 1;
        }

        .home-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #814ac8;
          box-shadow: 0 0 18px rgba(223,122,254,0.72);
          animation: orbPulse 2.4s ease-in-out infinite;
        }

        .home-hero-title {
          margin-top: 26px;
          max-width: 820px;
          color: #ffffff;
          font-size: clamp(54px, 8.5vw, 112px);
          font-weight: 800;
          letter-spacing: -0.052em;
          line-height: 0.92;
        }

        .home-hero-title span {
          background: linear-gradient(135deg, #ffffff 4%, #df7afe 58%, #a066d4 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .home-hero-body {
          margin-top: 26px;
          max-width: 620px;
          color: rgba(255,255,255,0.64);
          font-size: 17px;
          line-height: 1.75;
        }

        .home-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .home-cta-primary,
        .home-cta-secondary {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, border-color 180ms ease;
        }

        .home-cta-primary {
          border: 1px solid rgba(223,122,254,0.34);
          color: #ffffff;
          background: linear-gradient(135deg, #814ac8, #a066d4);
        }

        .home-cta-secondary {
          border: 1px solid rgba(255,255,255,0.13);
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.04);
        }

        .home-cta-primary:hover,
        .home-cta-secondary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        .home-cta-primary:active,
        .home-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .home-cta-primary:focus-visible,
        .home-cta-secondary:focus-visible {
          outline: 2px solid #df7afe;
          outline-offset: 3px;
        }

        .home-hero-note {
          margin-top: 18px;
          color: rgba(255,255,255,0.42);
          font-size: 13px;
          line-height: 1.7;
        }

        .homepage-constellation {
          position: relative;
          min-height: 560px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            radial-gradient(ellipse 86% 70% at 50% 50%, rgba(129,74,200,0.2), transparent 68%),
            rgba(255,255,255,0.025);
          overflow: hidden;
        }

        .homepage-constellation::before {
          content: "";
          position: absolute;
          inset: 14%;
          border: 1px solid rgba(129,74,200,0.18);
          border-radius: 999px;
        }

        .homepage-constellation::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(129,74,200,0.42), transparent);
        }

        .homepage-constellation-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .constellation-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(223,122,254,0.34);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 58%),
            rgba(13,13,13,0.72);
          backdrop-filter: blur(12px);
        }

        .constellation-core img {
          width: 46px;
          height: 46px;
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(223,122,254,0.65));
        }

        .constellation-label,
        .constellation-chip {
          position: absolute;
          z-index: 4;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(13,13,13,0.72);
          color: rgba(255,255,255,0.72);
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(12px);
        }

        .homepage-constellation-fallback {
          position: absolute;
          inset: 0;
          z-index: 5;
          background:
            radial-gradient(ellipse 70% 60% at 50% 48%, rgba(129,74,200,0.24), transparent 68%),
            rgba(0,0,0,0.18);
        }

        .constellation-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(129,74,200,0.22);
          border-radius: 999px;
          transform: translate(-50%, -50%);
        }

        .ring-one { width: 34%; height: 34%; }
        .ring-two { width: 58%; height: 46%; }
        .ring-three { width: 82%; height: 58%; }
        .chip-1 { left: 8%; top: 22%; }
        .chip-2 { right: 12%; top: 18%; }
        .chip-3 { right: 6%; top: 52%; }
        .chip-4 { right: 10%; bottom: 22%; }
        .chip-5 { left: 10%; bottom: 22%; }
        .chip-6 { left: 6%; top: 52%; }
        .chip-match { left: 50%; bottom: 8%; transform: translateX(-50%); color: #df7afe; }


        .match-table-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 38% at 50% 0%, rgba(129,74,200,0.18), transparent 72%),
            #0d0d0d;
        }

        .match-table-header {
          max-width: 900px;
          margin: 0 auto 30px;
          padding-top: 64px;
          text-align: center;
        }

        .home-section-title {
          margin-top: 14px;
          color: #ffffff;
          font-size: clamp(34px, 5vw, 62px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.98;
        }

        .home-section-body {
          margin: 18px auto 0;
          max-width: 720px;
          color: rgba(255,255,255,0.6);
          font-size: 16px;
          line-height: 1.75;
        }

        .dir-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 26px;
        }

        .dir-step {
          border: 1px solid rgba(129,74,200,0.18);
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          padding: 16px 18px;
          text-align: left;
        }

        .dir-step-num {
          color: rgba(223,122,254,0.8);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dir-step p {
          margin-top: 8px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 720px) {
          .dir-steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }


        .home-final {
          padding: 0 0 88px;
          background: #000000;
        }

        .home-final-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(129,74,200,0.25), rgba(129,74,200,0.07) 44%, transparent),
            radial-gradient(ellipse 85% 58% at 50% 0%, rgba(129,74,200,0.45), transparent 70%),
            #0d0d0d;
          padding: clamp(48px, 8vw, 88px) 24px;
          text-align: center;
        }

        .home-final-panel::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 96px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #df7afe, transparent);
        }

        .home-final-panel h2 {
          position: relative;
          margin: 0 auto;
          max-width: 820px;
          color: #ffffff;
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.98;
        }

        .home-final-panel p {
          position: relative;
          margin: 22px auto 0;
          max-width: 660px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        @media (max-width: 1080px) {
          .home-hero-grid,
          .principles-head {
            grid-template-columns: 1fr;
          }

          .home-hero-copy {
            padding-bottom: 0;
            text-align: center;
          }

          .home-hero-body,
          .home-cta-row {
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
          }

          .homepage-constellation {
            min-height: 460px;
          }

        }

        @media (max-width: 720px) {
          .home-shell {
            width: min(100% - 24px, 1180px);
          }

          .home-hero {
            min-height: auto;
            padding: 40px 0 52px;
          }

          .home-hero-title {
            font-size: clamp(46px, 16vw, 76px);
          }

          .home-hero-body {
            font-size: 15px;
          }

          .home-cta-primary,
          .home-cta-secondary {
            width: 100%;
          }

          .homepage-constellation {
            min-height: 360px;
            border-radius: 22px;
          }

          .constellation-label,
          .constellation-chip {
            padding: 7px 10px;
            font-size: 11px;
          }

          .constellation-core {
            width: 76px;
            height: 76px;
          }

          .constellation-core img {
            width: 38px;
            height: 38px;
          }

          .table-proof-grid {
            grid-template-columns: 1fr;
          }

          .table-proof {
            border-radius: 18px;
          }
        }
      `}</style>

      <section className="home-hero">
        <div className="home-hero-noise" aria-hidden="true" />
        <div className="home-shell home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-badge">
              <span className="home-badge-dot" />
              AI Match Engine
            </div>
            <h1 className="home-hero-title">
              Find Your Perfect <span>AI Match</span>
            </h1>
            <p className="home-hero-body">
              Explore AI tools for free, get personalized recommendations, or work with us to design and implement the right AI stack for your business.
            </p>
            <div className="home-cta-row">
              <Link href="/assessment" className="home-cta-primary">
                Start Free AI Match
              </Link>
            </div>
          </div>

          <HomepageConstellation />
        </div>
      </section>


      <section id="match-tools" className="match-table-section">
        <div className="px-4 pb-12">
          <div className="match-table-header">
            <h2 className="home-section-title">
              275 AI tools. Find what works for you.
            </h2>
            <div className="dir-steps-grid">
              <div className="dir-step">
                <span className="dir-step-num">01</span>
                <p>Select your category and subcategory to narrow your focus.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">02</span>
                <p>Apply filters based on pricing, free plan, API access, and more.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">03</span>
                <p>Compare tools side by side and customize columns as needed.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">04</span>
                <p>Bookmark your top picks and choose the best match for you.</p>
              </div>
            </div>
          </div>
          <DirectoryClient tools={tools} categories={categories} categoryMap={categoryMap} />
        </div>
      </section>


      <section className="home-final">
        <div className="home-shell">
          <div className="home-final-panel">
            <h2>Finding your match is just the start.</h2>
            <p>
              Explore tools freely. When you&apos;re ready, we help you turn them into real systems inside your business.
            </p>
            <div className="home-cta-row" style={{ justifyContent: "center" }}>
              <Link href="/assessment" className="home-cta-primary">
                Start the AI Match Engine
              </Link>
              <Link href="/services" className="home-cta-secondary">
                Get implementation help
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
