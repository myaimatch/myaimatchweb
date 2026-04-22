import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Services | myAIMatch",
  description:
    "See how myAIMatch connects AI strategy, stack implementation, and fractional AI leadership into one clear path.",
  openGraph: {
    title: "AI Services | myAIMatch",
    description:
      "See how myAIMatch connects AI strategy, stack implementation, and fractional AI leadership into one clear path.",
    url: "https://myaimatch.ai/services",
    type: "website",
  },
};

const services = [
  {
    step: "01",
    title: "Full AI Strategy Assessment",
    body: "Decide the right stack, the order to set it up, and what to ignore.",
    href: "/services/full-ai-strategy-assessment",
    cta: "Explore Strategy",
  },
  {
    step: "02",
    title: "AI Tech Stack Implementation",
    body: "Build, connect, document, and launch the stack your team will actually use.",
    href: "/services/ai-tech-stack-implementation",
    cta: "Explore Implementation",
  },
  {
    step: "03",
    title: "Fractional AI Lead",
    body: "Keep your team trained, your tools current, and your stack improving every month.",
    href: "/services/ai-coaching",
    cta: "Explore Fractional Lead",
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

        .services-video-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(223,122,254,0.2), transparent 70%);
          pointer-events: none;
        }

        .services-video-card {
          position: relative;
          z-index: 1;
          width: min(520px, 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          background: rgba(0,0,0,0.42);
          padding: 30px;
          text-align: center;
          backdrop-filter: blur(16px);
        }

        .services-play {
          display: grid;
          place-items: center;
          width: 74px;
          height: 74px;
          margin: 0 auto 20px;
          border: 1px solid rgba(223,122,254,0.38);
          border-radius: 999px;
          background: radial-gradient(circle, rgba(223,122,254,0.32), rgba(132,104,235,0.12));
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .services-video-card h2 {
          color: #ffffff;
          font-size: clamp(26px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .services-video-card p {
          margin-top: 14px;
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          line-height: 1.7;
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

        .services-path-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .services-path-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 320px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          background:
            radial-gradient(ellipse 90% 56% at 50% 100%, rgba(132,104,235,0.2), transparent 70%),
            rgba(255,255,255,0.035);
          padding: 26px;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
        }

        .services-path-card:hover {
          transform: translateY(-4px);
          border-color: rgba(223,122,254,0.34);
          background-color: rgba(255,255,255,0.045);
        }

        .services-path-card:focus-visible {
          outline: 2px solid #C4B5FD;
          outline-offset: 4px;
        }

        .services-path-card span {
          color: rgba(223,122,254,0.86);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .services-path-card h3 {
          margin-top: 72px;
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .services-path-card p {
          margin-top: 16px;
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          line-height: 1.65;
        }

        .services-path-card strong {
          margin-top: auto;
          padding-top: 28px;
          color: #C4B5FD;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        @media (max-width: 900px) {
          .services-path-grid {
            grid-template-columns: 1fr;
          }
          .services-video-frame {
            min-height: 340px;
          }
          .services-path-card {
            min-height: 260px;
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
          .services-video-card {
            padding: 24px;
          }
        }
      ` }} />

      <section className="services-overview-hero">
        <div className="services-overview-shell">
          <p className="services-overview-label">AI services</p>
          <h1 className="services-overview-title">
            From AI overwhelm to <span>working stack.</span>
          </h1>
          <p className="services-overview-body">
            Start with the right roadmap, build the system, then keep your team moving as the tools change.
          </p>

          <div className="services-video-frame" aria-label="Video overview placeholder">
            <div className="services-video-card">
              <div className="services-play" aria-hidden>Play</div>
              <h2>Three services. One clear path.</h2>
              <p>
                A short walkthrough will explain when to use Strategy, when to move into Implementation, and when a Fractional AI Lead keeps the stack sharp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-path">
        <div className="services-overview-shell">
          <div className="services-path-head">
            <p className="services-overview-label">How the services connect</p>
            <h2>Pick the step your business needs now.</h2>
          </div>
          <div className="services-path-grid">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="services-path-card">
                <span>{service.step}</span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <strong>{service.cta} -&gt;</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
