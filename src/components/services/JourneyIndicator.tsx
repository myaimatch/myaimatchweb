"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "strategy",
    label: "Strategy",
    href: "/services/full-ai-strategy-assessment",
    short: "01",
  },
  {
    id: "implementation",
    label: "Implementation",
    href: "/services/ai-tech-stack-implementation",
    short: "02",
  },
  {
    id: "lead",
    label: "Fractional Lead",
    href: "/services/ai-coaching",
    short: "03",
  },
] as const;

export default function JourneyIndicator() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIndex = STAGES.findIndex((s) => pathname?.startsWith(s.href));
  if (currentIndex === -1) return null;

  return (
    <>
      <style jsx>{`
        .journey {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 16px 10px 14px;
          border: 1px solid rgba(223, 122, 254, 0.24);
          border-radius: 999px;
          background: rgba(12, 12, 16, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(132, 104, 235, 0.18);
          transform: translateY(${mounted ? "0" : "32px"});
          opacity: ${mounted ? 1 : 0};
          transition: transform 720ms cubic-bezier(0.22, 1, 0.36, 1) 600ms,
            opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) 600ms;
        }

        .label {
          color: rgba(255, 255, 255, 0.68);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .label strong {
          color: #ffffff;
          margin-right: 4px;
        }

        .dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          position: relative;
          display: grid;
          place-items: center;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          transition: color 180ms ease, border-color 180ms ease, transform 180ms ease,
            background-color 180ms ease;
        }

        .dot:hover {
          color: #ffffff;
          border-color: rgba(223, 122, 254, 0.45);
          transform: translateY(-1px);
        }

        .dot.done {
          color: rgba(223, 122, 254, 0.78);
          border-color: rgba(223, 122, 254, 0.35);
          background: rgba(223, 122, 254, 0.08);
        }

        .dot.current {
          color: #ffffff;
          background: linear-gradient(135deg, #8468EB, #5B42C3);
          border-color: rgba(223, 122, 254, 0.65);
          box-shadow: 0 0 0 3px rgba(223, 122, 254, 0.18), 0 6px 18px rgba(132, 104, 235, 0.45);
        }

        .dot.current::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 1px solid rgba(223, 122, 254, 0.4);
          animation: haloBreathe 2.4s ease-in-out infinite;
        }

        .connector {
          width: 14px;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(223, 122, 254, 0.35),
            rgba(255, 255, 255, 0.12)
          );
        }

        @media (max-width: 640px) {
          .journey {
            right: 50%;
            bottom: 16px;
            transform: translate(50%, ${mounted ? "0" : "32px"});
            padding: 8px 12px;
            gap: 10px;
          }
          .journey .label {
            display: none;
          }
        }
      `}</style>

      <nav aria-label="Service journey progress" className="journey">
        <span className="label">
          <strong>{String(currentIndex + 1).padStart(2, "0")}</strong>
          /03 · {STAGES[currentIndex].label}
        </span>
        <div className="dots">
          {STAGES.map((stage, i) => {
            const status = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
            return (
              <Link
                key={stage.id}
                href={stage.href}
                className={`dot ${status}`}
                aria-label={`${stage.label}${status === "current" ? " (current step)" : ""}`}
                aria-current={status === "current" ? "step" : undefined}
              >
                {stage.short}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
