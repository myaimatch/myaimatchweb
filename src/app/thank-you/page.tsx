import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import myAiMatchWordmark from "../../../brand_assets/Group 97.png";

export const metadata: Metadata = {
  title: "Your AI Match Is Being Prepared",
  description:
    "Your AI Match assessment has been received. We are matching your profile to the right AI tools and sending your recommendation by email.",
  openGraph: {
    title: "Your AI Match Is Being Prepared | myAImatch",
    description:
      "Your AI Match assessment has been received. We are matching your profile to the right AI tools and sending your recommendation by email.",
    url: "https://myaimatch.ai/thank-you",
    type: "website",
  },
};

export default function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .thank-you-page {
          --ty-primary: #8468EB;
          --ty-accent: #C4B5FD;
          --ty-deep: #5B42C3;
          --ty-ink: rgba(255,255,255,0.68);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 64% 42% at 50% 0%, rgba(132,104,235,0.34), rgba(91,66,195,0.12) 42%, transparent 72%),
            radial-gradient(ellipse 44% 34% at 50% 56%, rgba(132,104,235,0.14), transparent 72%),
            #000000;
          color: #ffffff;
        }

        .thank-you-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(196,181,253,0.14) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 74% 62% at 50% 52%, rgba(0,0,0,0.5), transparent 72%);
          pointer-events: none;
        }

        .thank-you-shell {
          position: relative;
          z-index: 1;
          width: min(920px, calc(100% - 32px));
          margin: 0 auto;
          padding: 96px 0 88px;
          text-align: center;
        }

        .thank-you-beam {
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 156px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.9), rgba(132,104,235,0.54), transparent);
          pointer-events: none;
        }

        .thank-you-logo-card {
          display: inline-flex;
          min-height: 72px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 auto 36px;
          padding: 0 28px;
          border: 1px solid rgba(240,237,255,0.18);
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)),
            rgba(14,14,18,0.78);
          color: #ffffff;
          box-shadow:
            0 18px 52px rgba(91,66,195,0.36),
            0 0 0 1px rgba(255,255,255,0.1) inset;
        }

        .thank-you-logo {
          width: 196px;
          height: auto;
          object-fit: contain;
        }

        .thank-you-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          margin-bottom: 34px;
          border: 1px solid rgba(196,181,253,0.34);
          border-radius: 999px;
          padding: 0 20px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
            rgba(132,104,235,0.12);
          color: #E5C8FF;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: 0.01em;
          box-shadow: 0 0 32px rgba(132,104,235,0.12);
        }

        .thank-you-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #D87BFF;
          box-shadow: 0 0 18px rgba(216,123,255,0.78);
          animation: thank-you-pulse 1.7s ease-in-out infinite;
        }

        .thank-you-title {
          margin: 0 auto;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(48px, 7vw, 82px);
          font-weight: 850;
          letter-spacing: -0.052em;
          line-height: 0.98;
        }

        .thank-you-title span {
          display: block;
          background: linear-gradient(135deg, #ffffff 4%, #C4B5FD 48%, #8468EB 74%, #D87BFF 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .thank-you-copy {
          max-width: 620px;
          margin: 28px auto 0;
          color: var(--ty-ink);
          font-size: 18px;
          line-height: 1.8;
        }

        .thank-you-card {
          width: min(760px, 100%);
          margin: 64px auto 0;
          border: 1px solid rgba(196,181,253,0.24);
          border-radius: 28px;
          padding: clamp(24px, 4vw, 40px);
          background:
            radial-gradient(ellipse 78% 62% at 50% 0%, rgba(132,104,235,0.12), transparent 72%),
            linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015)),
            rgba(10,10,12,0.86);
          box-shadow:
            0 28px 80px rgba(0,0,0,0.46),
            0 0 56px rgba(132,104,235,0.14);
          text-align: left;
        }

        .thank-you-steps {
          display: grid;
          gap: 22px;
        }

        .thank-you-step {
          display: grid;
          grid-template-columns: 56px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
        }

        .thank-you-step-icon {
          display: inline-flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 21px;
          font-weight: 800;
          line-height: 1;
        }

        .thank-you-step-icon svg {
          width: 24px;
          height: 24px;
        }

        .thank-you-step-icon.is-done {
          border: 1px solid rgba(196,181,253,0.46);
          background: rgba(132,104,235,0.28);
          color: #ffffff;
          box-shadow: 0 0 26px rgba(132,104,235,0.22);
        }

        .thank-you-step-icon.is-running {
          border: 1px solid rgba(216,123,255,0.44);
          background: rgba(216,123,255,0.12);
          box-shadow: 0 0 28px rgba(216,123,255,0.24);
        }

        .thank-you-step-icon.is-next {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.72);
        }

        .thank-you-spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(216,123,255,0.22);
          border-top-color: #D87BFF;
          border-radius: 999px;
          animation: thank-you-spin 0.85s linear infinite;
        }

        .thank-you-step-title {
          color: #ffffff;
          font-size: 20px;
          font-weight: 780;
          line-height: 1.2;
        }

        .thank-you-step-sub {
          margin-top: 5px;
          color: rgba(255,255,255,0.42);
          font-size: 15px;
          font-weight: 650;
          line-height: 1.35;
        }

        .thank-you-status {
          color: rgba(255,255,255,0.28);
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .thank-you-status.is-done {
          color: #C4B5FD;
        }

        .thank-you-status.is-running {
          color: #D87BFF;
        }

        .thank-you-divider {
          height: 1px;
          margin: 30px 0 26px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent);
        }

        .thank-you-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: rgba(255,255,255,0.46);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
          text-align: center;
        }

        .thank-you-note svg {
          width: 21px;
          height: 21px;
          flex: 0 0 auto;
          opacity: 0.72;
        }

        .thank-you-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 42px;
        }

        .thank-you-secondary {
          display: inline-flex;
          min-height: 54px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          padding: 0 30px;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          font-weight: 780;
          text-align: center;
          text-decoration: none;
          background: rgba(255,255,255,0.025);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
        }

        .thank-you-secondary:hover,
        .thank-you-secondary:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(196,181,253,0.34);
          background: rgba(255,255,255,0.055);
          color: #ffffff;
          outline: none;
        }

        @keyframes thank-you-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.48; transform: scale(0.78); }
        }

        @keyframes thank-you-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 720px) {
          .thank-you-shell {
            width: min(100% - 28px, 920px);
            padding: 72px 0 68px;
          }

          .thank-you-logo-card {
            min-height: 64px;
            margin-bottom: 30px;
            padding: 0 22px;
          }

          .thank-you-logo {
            width: 170px;
          }

          .thank-you-pill {
            min-height: 38px;
            margin-bottom: 28px;
            padding: 0 16px;
            font-size: 13px;
          }

          .thank-you-title {
            font-size: clamp(38px, 12vw, 54px);
            letter-spacing: -0.045em;
          }

          .thank-you-copy {
            margin-top: 22px;
            font-size: 16px;
            line-height: 1.7;
          }

          .thank-you-card {
            margin-top: 44px;
            border-radius: 24px;
          }

          .thank-you-step {
            grid-template-columns: 46px minmax(0, 1fr);
            gap: 14px;
          }

          .thank-you-step-icon {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            font-size: 18px;
          }

          .thank-you-status {
            grid-column: 2;
            justify-self: start;
            margin-top: -7px;
            font-size: 12px;
          }

          .thank-you-step-title {
            font-size: 17px;
          }

          .thank-you-step-sub {
            font-size: 13px;
          }

          .thank-you-actions {
            display: grid;
            grid-template-columns: 1fr;
            width: min(100%, 360px);
            margin-inline: auto;
          }

          .thank-you-actions a {
            width: 100%;
          }
        }
      ` }} />

      <section className="thank-you-shell" aria-labelledby="thank-you-title">
        <div className="thank-you-beam" />
        <div className="thank-you-logo-card" aria-hidden="true">
          <Image
            src={myAiMatchWordmark}
            alt=""
            width={196}
            height={27}
            className="thank-you-logo"
            priority
          />
        </div>

        <div className="thank-you-pill">
          <span className="thank-you-pill-dot" />
          AI Match Engine &mdash; Processing
        </div>

        <h1 id="thank-you-title" className="thank-you-title">
          Your AI Match is{" "}
          <span>being prepared now.</span>
        </h1>

        <p className="thank-you-copy">
          Our engine is analyzing your profile against 300+ tools. Your personalized
          recommendation will land in your inbox shortly.
        </p>

        <div className="thank-you-card" aria-label="AI Match processing status">
          <div className="thank-you-steps">
            <div className="thank-you-step">
              <div className="thank-you-step-icon is-done" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="thank-you-step-title">Assessment received</div>
                <div className="thank-you-step-sub">Your profile has been captured</div>
              </div>
              <div className="thank-you-status is-done">DONE</div>
            </div>

            <div className="thank-you-step">
              <div className="thank-you-step-icon is-running" aria-hidden="true">
                <span className="thank-you-spinner" />
              </div>
              <div>
                <div className="thank-you-step-title">AI Match Engine is analyzing your needs</div>
                <div className="thank-you-step-sub">Matching tools to your workflow and team</div>
              </div>
              <div className="thank-you-status is-running">RUNNING</div>
            </div>

            <div className="thank-you-step">
              <div className="thank-you-step-icon is-next" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="thank-you-step-title">Recommendation email</div>
                <div className="thank-you-step-sub">Personalized AI tools and setup notes</div>
              </div>
              <div className="thank-you-status">NEXT</div>
            </div>
          </div>

          <div className="thank-you-divider" />

          <div className="thank-you-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 8L12 13L19.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Check your inbox &mdash; it usually arrives shortly.
          </div>
        </div>

        <div className="thank-you-actions">
          <Link href="/services" className="ai-match-cta">
            Explore our services
          </Link>
          <Link href="/#match-tools" className="thank-you-secondary">
            Browse the directory
          </Link>
        </div>
      </section>
    </div>
  );
}
