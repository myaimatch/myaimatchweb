"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import myAiMatchMark from "../../../brand_assets/Vector.png";
import { hasFreshThankYouAccess } from "@/lib/thank-you-access";

export default function ThankYouClient() {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (hasFreshThankYouAccess()) {
      setIsAllowed(true);
      return;
    }

    router.replace("/assessment");
  }, [router]);

  if (!isAllowed) {
    return (
      <div className="thank-you-page thank-you-page--checking">
        <style dangerouslySetInnerHTML={{ __html: `
          .thank-you-page {
            min-height: 100vh;
            background:
              radial-gradient(ellipse 64% 42% at 50% 0%, rgba(132,104,235,0.24), rgba(91,66,195,0.08) 42%, transparent 72%),
              #000000;
          }

          .thank-you-page--checking {
            display: grid;
            place-items: center;
          }

          .thank-you-checking-dot {
            width: 12px;
            height: 12px;
            border-radius: 999px;
            background: #8468EB;
            box-shadow: 0 0 28px rgba(132,104,235,0.7);
            animation: thank-you-pulse 1.4s ease-in-out infinite;
          }

          @keyframes thank-you-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.42; transform: scale(0.76); }
          }
        ` }} />
        <div className="thank-you-checking-dot" aria-hidden="true" />
      </div>
    );
  }

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
          padding: 92px 0 92px;
          text-align: center;
        }

        .thank-you-beam {
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 132px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.9), rgba(132,104,235,0.54), transparent);
          pointer-events: none;
        }

        .thank-you-logo-card {
          display: inline-flex;
          width: 136px;
          min-height: 72px;
          align-items: center;
          justify-content: center;
          margin: 0 auto 36px;
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
          width: 86px;
          height: auto;
          object-fit: contain;
        }

        .thank-you-title {
          margin: 0 auto;
          max-width: 820px;
          color: #ffffff;
          font-size: clamp(48px, 7vw, 78px);
          font-weight: 850;
          letter-spacing: -0.048em;
          line-height: 1.02;
        }

        .thank-you-title span {
          display: block;
          background: linear-gradient(135deg, #ffffff 4%, #C4B5FD 48%, #8468EB 76%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .thank-you-copy {
          max-width: 680px;
          margin: 30px auto 0;
          color: var(--ty-ink);
          font-size: 18px;
          line-height: 1.8;
        }

        .thank-you-card {
          width: min(760px, 100%);
          margin: 72px auto 0;
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

        .thank-you-step-icon.is-sending {
          border: 1px solid rgba(196,181,253,0.38);
          background: rgba(196,181,253,0.14);
          color: #ffffff;
          box-shadow: 0 0 28px rgba(132,104,235,0.2);
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
          color: #C4B5FD;
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.08em;
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
          color: rgba(255,255,255,0.52);
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

        @media (max-width: 720px) {
          .thank-you-shell {
            width: min(100% - 28px, 920px);
            padding: 72px 0 68px;
          }

          .thank-you-logo-card {
            width: 118px;
            min-height: 62px;
            margin-bottom: 30px;
          }

          .thank-you-logo {
            width: 74px;
          }

          .thank-you-title {
            font-size: clamp(38px, 12vw, 54px);
            letter-spacing: -0.042em;
            line-height: 1.05;
          }

          .thank-you-copy {
            margin-top: 22px;
            font-size: 16px;
            line-height: 1.7;
          }

          .thank-you-card {
            margin-top: 50px;
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
            src={myAiMatchMark}
            alt=""
            width={86}
            height={31}
            className="thank-you-logo"
            priority
          />
        </div>

        <h1 id="thank-you-title" className="thank-you-title">
          Your AI Match is{" "}
          <span>on its way.</span>
        </h1>

        <p className="thank-you-copy">
          We are comparing your profile against a highly curated base of AI tools.
          Your personalized recommendation is being sent to your inbox.
        </p>

        <div className="thank-you-card" aria-label="AI Match delivery status">
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
              <div className="thank-you-status">DONE</div>
            </div>

            <div className="thank-you-step">
              <div className="thank-you-step-icon is-sending" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="thank-you-step-title">Recommendation email is being sent</div>
                <div className="thank-you-step-sub">Personalized AI tools and setup notes are headed your way</div>
              </div>
              <div className="thank-you-status">SENDING</div>
            </div>
          </div>

          <div className="thank-you-divider" />

          <div className="thank-you-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 8L12 13L19.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Check your inbox. Your recommendation should arrive shortly.
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
