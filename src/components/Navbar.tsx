"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import AssessmentPopupTrigger from "@/components/assessment/AssessmentPopupTrigger";
import myAiMatchWordmark from "../../brand_assets/Group 97.png";

const serviceLinks = [
  {
    label: "Services Overview",
    href: "/services",
    desc: "See how strategy, implementation, and fractional support connect.",
  },
  {
    label: "Full AI Strategy Assessment",
    href: "/services/full-ai-strategy-assessment",
    desc: "Map your workflow and get a custom AI roadmap.",
  },
  {
    label: "AI Tools Implementation",
    href: "/services/ai-tools-implementation",
    desc: "We configure your tools and build the automations.",
  },
  {
    label: "Fractional AI Lead",
    href: "/services/ai-coaching",
    desc: "Embedded AI lead for your team — calls, async, and tool curation.",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const isServicesRoute = pathname === "/services" || pathname?.startsWith("/services/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 120;
          isolation: isolate;
        }

        .site-nav__layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .site-nav__backdrop {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(7,7,9,0.96), rgba(7,7,9,0.8)),
            radial-gradient(ellipse 56% 120% at 50% 0%, rgba(132,104,235,0.14), transparent 72%);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          opacity: 0.9;
          transition: opacity 220ms ease, backdrop-filter 220ms ease;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .site-nav.is-scrolled .site-nav__backdrop {
          opacity: 1;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .site-nav__band {
          position: absolute;
          left: 50%;
          bottom: -1px;
          width: min(1120px, 88vw);
          height: 82px;
          transform: translateX(-50%);
          background:
            radial-gradient(ellipse 62% 72% at 50% 0%, rgba(132,104,235,0.34), rgba(91,66,195,0.18) 42%, transparent 74%);
          filter: blur(16px);
          opacity: 0.75;
        }

        .site-nav__beam {
          position: absolute;
          left: 50%;
          bottom: -1px;
          width: min(1180px, 92vw);
          height: 1px;
          transform: translateX(-50%);
          background:
            linear-gradient(90deg, transparent, rgba(196,181,253,0.18) 18%, rgba(132,104,235,0.92) 50%, rgba(196,181,253,0.18) 82%, transparent);
          box-shadow: 0 0 18px rgba(132,104,235,0.55);
          opacity: 0.92;
        }

        .site-nav__inner {
          position: relative;
          width: min(1280px, calc(100% - 24px));
          margin: 0 auto;
          padding: 10px 0 6px;
        }

        .site-nav__shell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 70px;
          padding: 10px 16px 10px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
            rgba(9,9,12,0.78);
          box-shadow:
            0 20px 48px rgba(0,0,0,0.42),
            0 0 0 1px rgba(255,255,255,0.015) inset;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition: background 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }

        .site-nav.is-scrolled .site-nav__shell {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(10,10,12,0.9);
          border-color: rgba(255,255,255,0.1);
          box-shadow:
            0 24px 54px rgba(0,0,0,0.5),
            0 0 28px rgba(132,104,235,0.12),
            0 0 0 1px rgba(255,255,255,0.02) inset;
        }

        .site-nav__shell::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(196,181,253,0.09), transparent 28%),
            radial-gradient(ellipse 80% 120% at 50% -22%, rgba(132,104,235,0.18), transparent 55%);
          pointer-events: none;
          opacity: 0.95;
        }

        .site-nav__logo {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }

        .site-nav__logo img {
          width: 152px;
          height: auto;
          object-fit: contain;
        }

        .site-nav__center,
        .site-nav__actions {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
        }

        .site-nav__center {
          gap: 6px;
          justify-content: center;
          flex: 1;
        }

        .site-nav__actions {
          min-width: 232px;
          justify-content: flex-end;
          gap: 12px;
        }

        .site-nav__link,
        .site-nav__menu-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          color: rgba(255,255,255,0.58);
          font-size: 15px;
          font-weight: 550;
          letter-spacing: 0.005em;
          text-decoration: none;
          cursor: pointer;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .site-nav__link:hover,
        .site-nav__link:focus-visible,
        .site-nav__menu-button:hover,
        .site-nav__menu-button:focus-visible,
        .site-nav__link.is-active,
        .site-nav__menu-button.is-active {
          color: #ffffff;
          background: rgba(255,255,255,0.055);
          border-color: rgba(255,255,255,0.08);
          outline: none;
        }

        .site-nav__menu-button svg {
          width: 14px;
          height: 14px;
          opacity: 0.7;
          transition: transform 180ms ease, opacity 180ms ease;
        }

        .site-nav__menu-button.is-open svg {
          transform: rotate(180deg);
          opacity: 1;
        }

        .site-nav__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 28px;
          border: 1px solid rgba(196,181,253,0.18);
          border-radius: 999px;
          background:
            linear-gradient(135deg, rgba(132,104,235,0.98) 0%, rgba(91,66,195,0.98) 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow:
            0 12px 28px rgba(91,66,195,0.34),
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 0 26px rgba(132,104,235,0.18);
          transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
        }

        .site-nav__cta:hover,
        .site-nav__cta:focus-visible {
          opacity: 0.96;
          transform: translateY(-1px);
          box-shadow:
            0 18px 34px rgba(91,66,195,0.42),
            0 0 0 1px rgba(255,255,255,0.11) inset,
            0 0 34px rgba(132,104,235,0.28);
          outline: none;
        }

        .site-nav__mobile-trigger {
          position: relative;
          z-index: 1;
          display: none;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.74);
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
        }

        .site-nav__mobile-trigger:hover,
        .site-nav__mobile-trigger:focus-visible {
          background: rgba(255,255,255,0.08);
          border-color: rgba(132,104,235,0.24);
          color: #ffffff;
          outline: none;
        }

        .site-nav__dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          z-index: 200;
          width: min(420px, 72vw);
          transform: translateX(-50%);
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)),
            rgba(10,10,12,0.96);
          box-shadow:
            0 24px 60px rgba(0,0,0,0.54),
            0 0 34px rgba(132,104,235,0.12);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .site-nav__dropdown::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -12px;
          width: 42px;
          height: 18px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(132,104,235,0.42), transparent 72%);
          filter: blur(6px);
          pointer-events: none;
        }

        .site-nav__dropdown-link {
          display: block;
          padding: 14px 16px;
          border: 1px solid transparent;
          border-radius: 18px;
          text-decoration: none;
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }

        .site-nav__dropdown-link:hover,
        .site-nav__dropdown-link:focus-visible {
          background: rgba(255,255,255,0.05);
          border-color: rgba(132,104,235,0.16);
          transform: translateY(-1px);
          outline: none;
        }

        .site-nav__dropdown-link strong {
          display: block;
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 650;
          letter-spacing: -0.01em;
        }

        .site-nav__dropdown-link span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,0.46);
          font-size: 12px;
          line-height: 1.55;
        }

        .site-nav__overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,0.76);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .site-nav__drawer {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: min(360px, calc(100vw - 20px));
          height: 100vh;
          padding: 20px 18px 24px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
            radial-gradient(ellipse 64% 34% at 50% 0%, rgba(132,104,235,0.18), transparent 74%),
            rgba(7,7,10,0.98);
          border-left: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            -24px 0 60px rgba(0,0,0,0.48),
            -8px 0 32px rgba(132,104,235,0.08);
          overflow-y: auto;
        }

        .site-nav__drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .site-nav__drawer-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
        }

        .site-nav__drawer-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .site-nav__drawer-label {
          color: #8468EB;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 8px 14px 4px;
        }

        .site-nav__drawer-link {
          display: block;
          padding: 14px 16px;
          border: 1px solid transparent;
          border-radius: 20px;
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          font-weight: 550;
          text-decoration: none;
          background: rgba(255,255,255,0.02);
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }

        .site-nav__drawer-link:hover,
        .site-nav__drawer-link:focus-visible,
        .site-nav__drawer-link.is-active {
          background: rgba(255,255,255,0.06);
          border-color: rgba(132,104,235,0.18);
          color: #ffffff;
          outline: none;
        }

        .site-nav__drawer-link span {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,0.42);
          font-size: 12px;
          line-height: 1.55;
        }

        .site-nav__drawer-footer {
          margin-top: auto;
          padding-top: 12px;
        }

        .site-nav__drawer-footer .site-nav__cta {
          width: 100%;
        }

        @media (max-width: 920px) {
          .site-nav__inner {
            width: min(100% - 18px, 1280px);
            padding-top: 8px;
            padding-bottom: 4px;
          }

          .site-nav__shell {
            min-height: 66px;
            padding-right: 10px;
          }

          .site-nav__center,
          .site-nav__actions {
            display: none;
          }

          .site-nav__mobile-trigger {
            display: inline-flex;
          }

          .site-nav__logo img {
            width: 144px;
          }
        }

        @media (max-width: 640px) {
          .site-nav__inner {
            padding-top: 8px;
            padding-bottom: 2px;
          }

          .site-nav__shell {
            min-height: 62px;
            padding-left: 14px;
          }

          .site-nav__logo img {
            width: 136px;
          }
        }
      `}</style>

      <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-nav__layer" aria-hidden>
          <div className="site-nav__backdrop" />
          <div className="site-nav__band" />
          <div className="site-nav__beam" />
        </div>

        <div className="site-nav__inner">
          <div className="site-nav__shell">
            <Link href="/" className="site-nav__logo" aria-label="myAImatch home">
              <Image
                src={myAiMatchWordmark}
                alt="myAImatch"
                width={152}
                height={22}
                priority
              />
            </Link>

            <div className="site-nav__center">
              <Link
                href="/deals"
                className={`site-nav__link ${pathname === "/deals" ? "is-active" : ""}`}
              >
                Deals
              </Link>

              <div ref={servicesRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setServicesOpen((value) => !value)}
                  className={`site-nav__menu-button ${isServicesRoute ? "is-active" : ""} ${servicesOpen ? "is-open" : ""}`}
                  aria-haspopup="menu"
                  aria-expanded={servicesOpen}
                >
                  Services
                  <ChevronDown />
                </button>

                {servicesOpen ? (
                  <div className="site-nav__dropdown" role="menu">
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="site-nav__dropdown-link"
                        onClick={() => setServicesOpen(false)}
                      >
                        <strong>{service.label}</strong>
                        <span>{service.desc}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

            </div>

            <div className="site-nav__actions">
              {!isServicesRoute ? (
                <AssessmentPopupTrigger className="site-nav__cta" ctaLocation="navbar_desktop">
                  Start Free AI Match
                </AssessmentPopupTrigger>
              ) : null}
            </div>

            <button
              type="button"
              className="site-nav__mobile-trigger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="site-nav__overlay"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />

          <div className="site-nav__drawer">
            <div className="site-nav__drawer-header">
              <Image
                src={myAiMatchWordmark}
                alt="myAImatch"
                width={138}
                height={20}
                style={{ width: "138px", height: "auto" }}
              />
              <button
                type="button"
                className="site-nav__drawer-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="site-nav__drawer-group">
              <Link
                href="/deals"
                className={`site-nav__drawer-link ${pathname === "/deals" ? "is-active" : ""}`}
              >
                Deals
              </Link>
            </div>

            <div className="site-nav__drawer-group">
              <div className="site-nav__drawer-label">Services</div>
              {serviceLinks.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`site-nav__drawer-link ${pathname === service.href ? "is-active" : ""}`}
                >
                  {service.label}
                  <span>{service.desc}</span>
                </Link>
              ))}
            </div>

            {!isServicesRoute ? (
              <div className="site-nav__drawer-footer">
                <AssessmentPopupTrigger className="site-nav__cta" ctaLocation="navbar_mobile">
                  Start Free AI Match
                </AssessmentPopupTrigger>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}
