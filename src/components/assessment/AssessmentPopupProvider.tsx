"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPopup, type Popup } from "@typeform/embed";

type AssessmentPopupOpenOptions = {
  ctaLocation?: string;
  originPage?: string;
};

type AssessmentPopupContextValue = {
  openPopup: (options?: AssessmentPopupOpenOptions) => void;
  isOpen: boolean;
};

const TYPEFORM_FORM_ID = "LUpnruj4";
const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "origin_page",
  "origin_section",
  "cta_location",
] as const;

const AssessmentPopupContext = createContext<AssessmentPopupContextValue | null>(null);

function compactRecord(record: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(record).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

function AssessmentPopupHand({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes assessmentHandWave {
          0%, 100% { transform: rotate(0deg); }
          18% { transform: rotate(12deg); }
          36% { transform: rotate(-8deg); }
          54% { transform: rotate(10deg); }
          72% { transform: rotate(-4deg); }
        }

        @keyframes assessmentHandFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        @media (max-width: 767px) {
          .assessment-popup-hand-wrap {
            display: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="assessment-popup-hand-wrap"
        style={{
          position: "fixed",
          top: "max(72px, 8vh)",
          left: "calc(50% + min(360px, 25vw))",
          zIndex: 10050,
          pointerEvents: "none",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "88px",
            height: "88px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), rgba(129,74,200,0.18) 55%, rgba(13,13,13,0.96) 100%)",
            border: "1px solid rgba(223,122,254,0.28)",
            boxShadow:
              "0 0 0 1px rgba(223,122,254,0.12), 0 24px 60px rgba(0,0,0,0.45), 0 0 42px rgba(129,74,200,0.28)",
            animation: "assessmentHandFloat 3.4s ease-in-out infinite",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-10px",
              borderRadius: "999px",
              background:
                "radial-gradient(circle, rgba(223,122,254,0.26) 0%, rgba(223,122,254,0.04) 52%, transparent 72%)",
              filter: "blur(8px)",
            }}
          />
          <span
            style={{
              position: "relative",
              fontSize: "34px",
              lineHeight: 1,
              transformOrigin: "70% 75%",
              animation: "assessmentHandWave 1.9s ease-in-out infinite",
            }}
          >
            👋
          </span>
        </div>
      </div>
    </>
  );
}

export default function AssessmentPopupProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const popupRef = useRef<Popup | null>(null);
  const popupConfigRef = useRef<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback((options?: AssessmentPopupOpenOptions) => {
    if (typeof window === "undefined") {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tracking = compactRecord(
      Object.fromEntries(
        TRACKING_PARAMS.map((key) => [key, urlParams.get(key) ?? undefined])
      )
    );

    const hidden = compactRecord({
      origin_page: options?.originPage ?? window.location.pathname,
      cta_location: options?.ctaLocation,
    });

    const popupConfig = JSON.stringify({ tracking, hidden });

    if (popupRef.current && popupConfigRef.current !== popupConfig) {
      popupRef.current.unmount();
      popupRef.current = null;
      popupConfigRef.current = "";
    }

    if (!popupRef.current) {
      popupRef.current = createPopup(TYPEFORM_FORM_ID, {
        size: 86,
        medium: "myaimatch-web",
        mediumVersion: "next14",
        hidden,
        tracking,
        transitiveSearchParams: [...TRACKING_PARAMS],
        preventReopenOnClose: true,
        respectOpenModals: "all",
        onReady: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
      });
      popupConfigRef.current = popupConfig;
    }

    setIsOpen(true);
    popupRef.current.open();
  }, []);

  useEffect(() => {
    return () => {
      popupRef.current?.unmount();
    };
  }, []);

  const value = useMemo(
    () => ({
      openPopup,
      isOpen,
    }),
    [isOpen, openPopup]
  );

  return (
    <AssessmentPopupContext.Provider value={value}>
      {children}
      <AssessmentPopupHand isVisible={isOpen} />
    </AssessmentPopupContext.Provider>
  );
}

export function useAssessmentPopup() {
  const context = useContext(AssessmentPopupContext);

  if (!context) {
    throw new Error("useAssessmentPopup must be used within AssessmentPopupProvider.");
  }

  return context;
}
