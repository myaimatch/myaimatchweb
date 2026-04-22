"use client";

import { useEffect, useRef } from "react";
import AssessmentPopupTrigger from "@/components/assessment/AssessmentPopupTrigger";

export default function BannerCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const children = el.querySelectorAll<HTMLElement>("[data-animate]");
    children.forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(24px)";
      child.style.transition = "none";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.transition =
              "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
            child.style.opacity = "1";
            child.style.transform = "translateY(0)";
          }, i * 120);
        });
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 md:px-8 py-16">
      <style>{`
        @keyframes ringPulse {
          0%   { transform: scale(0.85); opacity: 0.6; }
          60%  { transform: scale(1.12); opacity: 0.15; }
          100% { transform: scale(1.25); opacity: 0;   }
        }
        @keyframes ringFloat {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.06); opacity: 0.7; }
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden flex flex-col md:flex-row items-center gap-10 px-8 md:px-14 py-12 md:py-16"
        style={{
          background: "linear-gradient(135deg, #7B5FD6 0%, #9B7FFF 50%, #8468EB 100%)",
        }}
      >
        {/* Left: text + CTA */}
        <div
          ref={sectionRef}
          className="md:w-3/5 text-center md:text-left flex flex-col gap-5"
        >
          <h2
            data-animate
            className="text-2xl md:text-3xl font-bold text-white leading-snug"
          >
            Not Sure Which Tools Are Right for You?
          </h2>
          <p data-animate className="text-white/80 text-base leading-relaxed">
            Most businesses waste months testing tools that were never a fit.
            Tell us about your workflow and team — we&apos;ll match you to the exact
            tools that solve your actual problems.
          </p>
          <p data-animate className="text-white font-medium text-sm">
            Free. 2 minutes. No sales call required.
          </p>
          <div data-animate>
            <AssessmentPopupTrigger
              ctaLocation="banner_cta"
              className="inline-block font-semibold text-base px-8 py-4 rounded-full transition-all"
              style={{
                background: "white",
                color: "#131313",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.9";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              Start the AI Match Engine
            </AssessmentPopupTrigger>
          </div>
        </div>

        {/* Right: animated rings */}
        <div
          className="hidden md:flex md:w-2/5 items-center justify-center relative"
          style={{ height: 240 }}
        >
          <div
            className="absolute rounded-full border border-white/10"
            style={{
              width: 220,
              height: 220,
              animation: "ringPulse 3s ease-out infinite",
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute rounded-full border border-white/20"
            style={{
              width: 160,
              height: 160,
              animation: "ringPulse 3s ease-out infinite",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute rounded-full border border-white/30"
            style={{
              width: 100,
              height: 100,
              animation: "ringPulse 3s ease-out infinite",
              animationDelay: "2s",
            }}
          />
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.4)",
              animation: "ringFloat 4s ease-in-out infinite",
              boxShadow: "0 0 24px rgba(255,255,255,0.15)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
