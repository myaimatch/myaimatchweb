"use client";

import { useEffect, useRef } from "react";
import AssessmentPopupTrigger from "./AssessmentPopupTrigger";
import { useAssessmentPopup } from "./AssessmentPopupProvider";

export default function AssessmentRouteOpener() {
  const { openPopup } = useAssessmentPopup();
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (hasOpenedRef.current) {
      return;
    }

    hasOpenedRef.current = true;
    const timeoutId = window.setTimeout(() => {
      openPopup({
        originPage: "/assessment",
        ctaLocation: "assessment_route_opener",
      });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [openPopup]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        background:
          "radial-gradient(ellipse 72% 48% at 50% 0%, rgba(132,104,235,0.34), transparent 70%), #000000",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          width: "min(760px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "72px 0 88px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            marginBottom: "16px",
            padding: "6px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(132,104,235,0.35)",
            background: "rgba(132,104,235,0.12)",
            color: "#C4B5FD",
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
            margin: "0 0 16px",
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          Opening your AI Match
        </h1>
        <p
          style={{
            maxWidth: "620px",
            margin: "0 auto 28px",
            color: "rgba(255,255,255,0.68)",
            fontSize: "16px",
            lineHeight: 1.75,
          }}
        >
          If the popup did not open automatically, use the button below to launch the
          Typeform assessment.
        </p>

        <AssessmentPopupTrigger
          ctaLocation="assessment_route_fallback"
          originPage="/assessment"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            padding: "14px 28px",
            background: "linear-gradient(135deg, #8468EB 0%, #5B42C3 100%)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow:
              "0 0 0 1px rgba(132,104,235,0.36), 0 10px 32px rgba(132,104,235,0.26)",
          }}
        >
          Open the AI Match Engine
        </AssessmentPopupTrigger>
      </section>
    </div>
  );
}
