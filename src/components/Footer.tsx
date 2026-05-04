import Link from "next/link";
import Image from "next/image";
import AssessmentPopupTrigger from "@/components/assessment/AssessmentPopupTrigger";
import myAiMatchWordmark from "../../brand_assets/Group 97.png";

const serviceLinks = [
  { label: "AI Strategy Roadmap", href: "/ai-strategy-roadmap" },
  { label: "AI Implementation", href: "/ai-implementation" },
  { label: "AI Advisory", href: "/fractional-ai-advisor" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(ellipse 72% 60% at 50% 0%, rgba(132,104,235,0.14), transparent 72%),
            #0d0d0d;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .site-footer::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -1px;
          width: 2px;
          height: 168px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(196,181,253,0.78), rgba(132,104,235,0.32), transparent);
          box-shadow: 0 0 20px rgba(132,104,235,0.42);
          pointer-events: none;
        }

        .site-footer__inner {
          position: relative;
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 72px 0 32px;
        }

        .site-footer__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 64px;
          align-items: start;
        }

        .site-footer__brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 460px;
        }

        .site-footer__logo {
          display: inline-block;
        }

        .site-footer__tagline {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.7;
          max-width: 420px;
        }

        .site-footer__cta {
          min-height: 48px;
          padding: 0 26px;
          margin-top: 4px;
          font-size: 14px;
        }

        .site-footer__services {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .site-footer__label {
          color: #8468EB;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .site-footer__links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .site-footer__link {
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          text-decoration: none;
          transition: color 180ms ease, transform 180ms ease;
          width: fit-content;
        }

        .site-footer__link:hover,
        .site-footer__link:focus-visible {
          color: #ffffff;
          transform: translateX(2px);
          outline: none;
        }

        .site-footer__divider {
          margin: 56px 0 20px;
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .site-footer__bottom {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .site-footer__legal {
          color: rgba(255,255,255,0.42);
          font-size: 12px;
        }

        .site-footer__legal-links {
          display: flex;
          gap: 22px;
        }

        .site-footer__legal-link {
          color: rgba(255,255,255,0.42);
          font-size: 12px;
          text-decoration: none;
          transition: color 180ms ease;
        }

        .site-footer__legal-link:hover,
        .site-footer__legal-link:focus-visible {
          color: #ffffff;
          outline: none;
        }

        @media (max-width: 760px) {
          .site-footer__inner {
            padding: 56px 0 24px;
          }

          .site-footer__grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }

          .site-footer__divider {
            margin: 44px 0 18px;
          }

          .site-footer__bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>

      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="myAImatch home">
              <Image
                src={myAiMatchWordmark}
                alt="myAImatch"
                width={188}
                height={26}
                style={{ width: "188px", height: "auto", objectFit: "contain" }}
                priority
              />
            </Link>
            <p className="site-footer__tagline">
              Start with the right AI tools. Build the right AI strategy. Scale smarter with AI.
            </p>
            <AssessmentPopupTrigger ctaLocation="footer_primary" className="site-footer__cta ai-match-cta">
              Claim Your Free AI Match
            </AssessmentPopupTrigger>
          </div>

          <div className="site-footer__services">
            <p className="site-footer__label">Services</p>
            <div className="site-footer__links">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="site-footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className="site-footer__divider" />

        <div className="site-footer__bottom">
          <p className="site-footer__legal">© 2026 myAImatch. All rights reserved.</p>
          <div className="site-footer__legal-links">
            <Link href="/privacy" className="site-footer__legal-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="site-footer__legal-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
