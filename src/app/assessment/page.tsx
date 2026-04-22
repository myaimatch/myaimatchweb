import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Use the AI Match Engine to get a free personalized AI stack recommendation for your workflow and team.",
  openGraph: {
    title: "myAIMatch — AI Match Engine",
    description:
      "Use the AI Match Engine to get a free personalized AI stack recommendation for your workflow and team.",
    url: "https://myaimatch.ai/assessment",
    type: "website",
  },
};

export default function AssessmentPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        background:
          "radial-gradient(ellipse 72% 48% at 50% 0%, rgba(129,74,200,0.34), transparent 70%), #000000",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          width: "min(1080px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "48px 0 72px",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: "16px",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(129,74,200,0.35)",
              background: "rgba(129,74,200,0.12)",
              color: "#df7afe",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            AI Match Engine
          </div>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(34px, 5vw, 56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              fontWeight: 700,
            }}
          >
            Get Your Free AI Match
          </h1>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.72)",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Tell us about your workflow, team, and current tools. We&apos;ll match you
            with the AI stack that fits how you actually work.
          </p>
        </div>

        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(13,13,13,0.92)",
            boxShadow:
              "0 0 0 1px rgba(129,74,200,0.08), 0 24px 80px rgba(0,0,0,0.45)",
            overflow: "hidden",
          }}
        >
          <div data-tf-live="01KPV4EWKQZYYBMJ9T2A97HRCK" />
        </div>
      </section>

      <Script src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />
    </div>
  );
}
