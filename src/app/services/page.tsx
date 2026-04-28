import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Services | myAImatch",
  description:
    "See how myAImatch connects AI strategy, systems implementation, and fractional AI leadership into one clear path.",
  openGraph: {
    title: "AI Services | myAImatch",
    description:
      "See how myAImatch connects AI strategy, systems implementation, and fractional AI leadership into one clear path.",
    url: "https://myaimatch.ai/services",
    type: "website",
  },
};

const services = [
  {
    title: "AI Workflow Audit + Strategy Roadmap",
    body: "Map your highest-ROI opportunities in AI, get a custom AI roadmap, and build a 30-60-90 day implementation plan.",
    href: "/ai-strategy-roadmap",
    cta: "Learn more",
    deliverables: [
      "Strategic Discovery Session",
      "Workflow Audit — 1 Major Workflow",
      "Strategic Priority Mapping",
      "Recommended AI Tool Stack",
      "Quick-Win Implementation Plan",
      "Follow-Up Strategy Session",
    ],
  },
  {
    title: "AI Implementation & Systems Setup",
    body: "Deploy the AI systems, workflows, copilots, and adoption processes your team will actually use.",
    href: "/ai-implementation",
    cta: "Learn more",
    deliverables: [
      "AI Workflow Automation",
      "Internal AI Copilots",
      "Prompt Libraries + SOP Systems",
      "Client Onboarding Systems",
      "Sales Follow-Up Automation",
      "Reporting + Operations Systems",
      "Team Enablement + Training",
      "Documentation + Handoff",
    ],
  },
  {
    title: "Fractional AI Advisory",
    body: "Executive-level AI leadership without the full-time hire. Ongoing strategy, optimization, and guidance.",
    href: "/fractional-ai-advisor",
    cta: "Learn more",
    deliverables: [
      "Monthly Strategic Advisory Calls",
      "Workflow Optimization",
      "AI Investment Prioritization",
      "New Opportunity Identification",
      "Vendor + Tool Evaluation",
      "Internal Team Guidance",
      "Leadership Decision Support",
      "Priority Strategic Access",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="services-overview bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .services-overview {
          --service-primary: #8468EB;
          --service-accent: #C4B5FD;
          --service-muted: rgba(255,255,255,0.62);
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(ellipse 72% 42% at 50% 0%, rgba(132,104,235,0.32), transparent 70%),
            #000000;
        }

        .services-overview-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .services-overview-hero {
          position: relative;
          padding: 92px 0 72px;
          text-align: center;
        }

        .services-overview-hero::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 150px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.72), transparent);
          pointer-events: none;
        }

        .services-overview-label {
          color: var(--service-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .services-overview-title {
          margin: 18px auto 0;
          max-width: 980px;
          color: #ffffff;
          font-size: clamp(48px, 8vw, 104px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.95;
        }

        .services-overview-title span {
          background: linear-gradient(135deg, #ffffff 8%, #C4B5FD 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .services-overview-body {
          margin: 24px auto 0;
          max-width: 720px;
          color: var(--service-muted);
          font-size: 17px;
          line-height: 1.75;
        }

        .services-video-frame {
          position: relative;
          overflow: hidden;
          margin: 54px auto 0;
          max-width: 980px;
          min-height: 430px;
          border: 1px solid rgba(223,122,254,0.2);
          border-radius: 28px;
          background:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            radial-gradient(ellipse 72% 62% at 50% 50%, rgba(132,104,235,0.32), transparent 72%),
            rgba(255,255,255,0.035);
          background-size: 64px 64px, 64px 64px, auto, auto;
          display: grid;
          place-items: center;
          padding: 28px;
          box-shadow: 0 24px 90px rgba(0,0,0,0.5);
        }

        .services-video-slot {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 860px;
          aspect-ratio: 16 / 9;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
            rgba(0,0,0,0.34);
          box-shadow: inset 0 0 0 1px rgba(132,104,235,0.08);
          backdrop-filter: blur(10px);
        }

        .services-video-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(223,122,254,0.2), transparent 70%);
          pointer-events: none;
        }

        .services-path {
          padding: 18px 0 104px;
        }

        .services-path-head {
          max-width: 760px;
          margin: 0 auto 36px;
          text-align: center;
        }

        .services-path-head h2 {
          margin-top: 14px;
          color: #ffffff;
          font-size: clamp(34px, 5vw, 62px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .services-comparison-table {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 76% 48% at 50% 100%, rgba(132,104,235,0.18), transparent 70%),
            rgba(255,255,255,0.035);
          box-shadow: 0 28px 90px rgba(0,0,0,0.34);
        }

        .services-comparison-column {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 560px;
          padding: 30px;
          text-decoration: none;
          border-right: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
          transition: background-color 180ms ease;
        }

        .services-comparison-column:last-child {
          border-right: 0;
        }

        .services-comparison-column:hover {
          background-color: rgba(255,255,255,0.045);
        }

        .services-comparison-column:focus-visible {
          outline: 2px solid #C4B5FD;
          outline-offset: -2px;
        }

        .services-column-kicker {
          color: rgba(223,122,254,0.86);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .services-comparison-column h3 {
          margin-top: 18px;
          color: #ffffff;
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.04;
        }

        .services-comparison-body {
          margin-top: 16px;
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          line-height: 1.65;
        }

        .services-included-label {
          margin-top: 30px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .services-deliverables-list {
          display: grid;
          gap: 13px;
          margin: 18px 0 0;
          padding: 0;
          list-style: none;
        }

        .services-deliverables-list li {
          position: relative;
          padding-left: 22px;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          line-height: 1.45;
        }

        .services-deliverables-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.58em;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #C4B5FD;
          box-shadow: 0 0 16px rgba(196,181,253,0.75);
        }

        .services-comparison-cta {
          margin-top: auto;
          padding-top: 28px;
          color: #C4B5FD;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        @media (max-width: 900px) {
          .services-comparison-table {
            grid-template-columns: 1fr;
          }
          .services-comparison-column {
            min-height: auto;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .services-comparison-column:last-child {
            border-bottom: 0;
          }
          .services-video-frame {
            min-height: 340px;
          }
        }

        @media (max-width: 640px) {
          .services-overview-shell {
            width: min(100% - 24px, 1180px);
          }
          .services-overview-hero {
            padding-top: 72px;
          }
          .services-video-frame {
            border-radius: 22px;
            padding: 16px;
          }
          .services-comparison-column {
            padding: 24px;
          }
        }
      ` }} />

      <section className="services-overview-hero">
        <div className="services-overview-shell">
          <p className="services-overview-label">AI services</p>
          <h1 className="services-overview-title">
            Turn AI Into Real Operational Impact<span>—Not Just Tools</span>
          </h1>
          <p className="services-overview-body">
            Start with the right roadmap, build the system, then keep your team moving as the tools change.
          </p>

          <div className="services-video-frame" aria-label="Services overview video placeholder">
            <div className="services-video-slot" />
          </div>
        </div>
      </section>

      <section className="services-path">
        <div className="services-overview-shell">
          <div className="services-path-head">
            <p className="services-overview-label">Compare services</p>
            <h2>Choose the support your business needs now.</h2>
          </div>
          <div className="services-comparison-table">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="services-comparison-column">
                <span className="services-column-kicker">Service</span>
                <h3>{service.title}</h3>
                <p className="services-comparison-body">{service.body}</p>
                <p className="services-included-label">What&apos;s included</p>
                <ul className="services-deliverables-list">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
                <strong className="services-comparison-cta">{service.cta} -&gt;</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
