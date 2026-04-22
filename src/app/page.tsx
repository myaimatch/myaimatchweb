import Link from "next/link";
import type { Metadata } from "next";
import HomepageConstellation from "@/components/HomepageConstellation";
import DirectoryClient from "@/components/DirectoryClient";
import HomeSignalField from "@/components/home/HomeSignalField";
import MatchEngineFrame from "@/components/home/MatchEngineFrame";
import MatchOutputPreview from "@/components/home/MatchOutputPreview";
import { fetchAllCategories, fetchAllTools } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "myAIMatch - Find AI Tools You'll Actually Use",
  description:
    "Use the AI Match Engine to get AI tool recommendations for your workflow, team, budget, and implementation goals.",
  openGraph: {
    title: "myAIMatch - Find AI Tools You'll Actually Use",
    description:
      "Use the AI Match Engine to get AI tool recommendations for your workflow, team, budget, and implementation goals.",
    url: "https://myaimatch.ai",
    type: "website",
  },
};


export default async function HomePage() {
  const [tools, categories] = await Promise.all([fetchAllTools(), fetchAllCategories()]);

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name;
  }

  return (
    <div className="home-ramp bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .home-ramp {
          --home-primary: #814ac8;
          --home-accent: #df7afe;
          --home-card: rgba(255,255,255,0.04);
          --home-border: rgba(255,255,255,0.08);
          --home-muted: rgba(255,255,255,0.6);
          --home-dim: rgba(255,255,255,0.4);
          position: relative;
          overflow: hidden;
        }

        .home-ramp > section {
          position: relative;
          z-index: 1;
        }

        .home-scroll-progress {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 250;
          width: 100%;
          height: 2px;
          transform-origin: left center;
          background: linear-gradient(90deg, #814ac8, #df7afe);
          pointer-events: none;
        }

        .home-signal-field {
          position: absolute;
          inset: 0 auto auto 0;
          z-index: 0;
          width: 100%;
          min-height: 180vh;
          pointer-events: none;
          opacity: 0.9;
          mix-blend-mode: screen;
        }

        .home-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .home-label {
          color: var(--home-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .home-hero {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 36px 0 64px;
          background:
            radial-gradient(ellipse 80% 54% at 50% 0%, rgba(129,74,200,0.42), transparent 68%),
            radial-gradient(ellipse 56% 44% at 78% 34%, rgba(223,122,254,0.14), transparent 68%),
            radial-gradient(ellipse 40% 30% at 12% 82%, rgba(129,74,200,0.08), transparent 60%),
            #000000;
        }

        .home-hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          opacity: 0.032;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        .home-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 82px 82px;
          mask-image: radial-gradient(ellipse 72% 58% at 50% 16%, black, transparent 76%);
          pointer-events: none;
        }

        .home-hero::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 170px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.72), transparent);
          pointer-events: none;
        }

        .home-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 0.86fr);
          gap: 34px;
          align-items: center;
        }

        .home-hero-copy {
          padding: 44px 0;
        }

        .home-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.68);
          font-size: 12px;
          line-height: 1;
        }

        .home-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #814ac8;
          box-shadow: 0 0 18px rgba(223,122,254,0.72);
          animation: orbPulse 2.4s ease-in-out infinite;
        }

        .home-hero-title {
          margin-top: 26px;
          max-width: 820px;
          color: #ffffff;
          font-size: clamp(54px, 8.5vw, 112px);
          font-weight: 800;
          letter-spacing: -0.052em;
          line-height: 0.92;
        }

        .home-hero-title span {
          background: linear-gradient(135deg, #ffffff 4%, #df7afe 58%, #a066d4 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .home-hero-body {
          margin-top: 26px;
          max-width: 620px;
          color: rgba(255,255,255,0.64);
          font-size: 17px;
          line-height: 1.75;
        }

        .home-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .home-cta-primary,
        .home-cta-secondary {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, border-color 180ms ease;
        }

        .home-cta-primary {
          border: 1px solid rgba(223,122,254,0.34);
          color: #ffffff;
          background: linear-gradient(135deg, #814ac8, #a066d4);
        }

        .home-cta-secondary {
          border: 1px solid rgba(255,255,255,0.13);
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.04);
        }

        .home-cta-primary:hover,
        .home-cta-secondary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        .home-cta-primary:active,
        .home-cta-secondary:active {
          opacity: 1;
          transform: scale(0.97) translateY(0);
          transition: transform 80ms ease, opacity 80ms ease;
        }

        .home-cta-primary:focus-visible,
        .home-cta-secondary:focus-visible {
          outline: 2px solid #df7afe;
          outline-offset: 3px;
        }

        .home-hero-note {
          margin-top: 18px;
          color: rgba(255,255,255,0.42);
          font-size: 13px;
          line-height: 1.7;
        }

        .homepage-constellation {
          position: relative;
          min-height: 560px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            radial-gradient(ellipse 86% 70% at 50% 50%, rgba(129,74,200,0.2), transparent 68%),
            rgba(255,255,255,0.025);
          overflow: hidden;
        }

        .homepage-constellation::before {
          content: "";
          position: absolute;
          inset: 14%;
          border: 1px solid rgba(129,74,200,0.18);
          border-radius: 999px;
        }

        .homepage-constellation::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(129,74,200,0.42), transparent);
        }

        .homepage-constellation-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .constellation-connectors {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .constellation-connectors path {
          fill: none;
          stroke: rgba(223,122,254,0.44);
          stroke-width: 0.18;
          stroke-linecap: round;
          stroke-dasharray: 2.2 2.8;
          filter: drop-shadow(0 0 5px rgba(223,122,254,0.5));
        }

        .constellation-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(223,122,254,0.58);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at center, rgba(223,122,254,0.18), transparent 62%),
            rgba(129,74,200,0.08);
          box-shadow:
            0 0 0 8px rgba(223,122,254,0.08),
            0 0 34px rgba(223,122,254,0.36),
            inset 0 0 26px rgba(223,122,254,0.2);
          backdrop-filter: blur(12px);
        }

        .constellation-core img {
          width: 58px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 13px rgba(223,122,254,0.72));
        }

        .constellation-match-label {
          position: absolute;
          left: 50%;
          top: calc(50% + 66px);
          z-index: 6;
          transform: translateX(-50%);
          color: #df7afe;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1;
          text-shadow: 0 0 18px rgba(223,122,254,0.62);
          white-space: nowrap;
        }

        .constellation-label,
        .constellation-chip {
          position: absolute;
          z-index: 4;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(13,13,13,0.72);
          color: rgba(255,255,255,0.72);
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 18px rgba(129,74,200,0.12);
          transform-origin: center;
          white-space: nowrap;
          will-change: left, top, transform, opacity;
        }

        .homepage-constellation-fallback {
          position: absolute;
          inset: 0;
          z-index: 5;
          background:
            radial-gradient(ellipse 70% 60% at 50% 48%, rgba(129,74,200,0.24), transparent 68%),
            rgba(0,0,0,0.18);
        }

        .constellation-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(129,74,200,0.22);
          border-radius: 999px;
          transform: translate(-50%, -50%);
        }

        .ring-one { width: 34%; height: 34%; }
        .ring-two { width: 58%; height: 46%; }
        .ring-three { width: 82%; height: 58%; }


        .match-table-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 78% 42% at 50% 0%, rgba(129,74,200,0.25), transparent 72%),
            linear-gradient(180deg, rgba(129,74,200,0.06), transparent 22%),
            #0d0d0d;
        }

        .match-table-section::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 140px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(223,122,254,0.65), transparent);
        }

        .match-table-header {
          max-width: 900px;
          margin: 0 auto 34px;
          padding-top: 64px;
          text-align: center;
        }

        .home-section-title {
          margin-top: 14px;
          color: #ffffff;
          font-size: clamp(34px, 5vw, 62px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.98;
        }

        .home-section-body {
          margin: 18px auto 0;
          max-width: 720px;
          color: rgba(255,255,255,0.6);
          font-size: 16px;
          line-height: 1.75;
        }

        .dir-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 26px;
        }

        .dir-step {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(129,74,200,0.18);
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          padding: 16px 18px;
          text-align: left;
        }

        .dir-step::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -42px;
          width: 160px;
          height: 70px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(129,74,200,0.35), transparent 70%);
          filter: blur(8px);
          opacity: 0.25;
          pointer-events: none;
        }

        .dir-step-num {
          color: rgba(223,122,254,0.8);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dir-step p {
          margin-top: 8px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 720px) {
          .dir-steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .match-engine-frame {
          position: relative;
          width: min(1420px, 100%);
          margin: 0 auto;
          border: 1px solid rgba(223,122,254,0.18);
          border-radius: 28px;
          background:
            radial-gradient(ellipse 90% 42% at 50% 0%, rgba(129,74,200,0.18), transparent 72%),
            rgba(255,255,255,0.025);
          padding: 16px;
          overflow: hidden;
        }

        .match-engine-frame::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(255,255,255,0.045);
          border-radius: 22px;
          pointer-events: none;
        }

        .engine-status-bar {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(0,0,0,0.26);
          padding: 12px 14px;
        }

        .engine-status-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          min-height: 56px;
          border-right: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.72);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .engine-status-live span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #df7afe;
          box-shadow: 0 0 20px rgba(223,122,254,0.72);
          animation: orbPulse 2.2s ease-in-out infinite;
        }

        .engine-status-count {
          min-height: 56px;
          text-align: center;
        }

        .engine-status-count strong {
          display: block;
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          line-height: 1.1;
        }

        .engine-status-count span {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .engine-flow-preview {
          position: relative;
          z-index: 1;
          height: 112px;
          margin: 0 8px -10px;
          pointer-events: none;
        }

        .engine-flow-preview svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .engine-flow-preview path {
          fill: none;
          stroke: rgba(223,122,254,0.5);
          stroke-width: 1.4;
          stroke-linecap: round;
          stroke-dasharray: 420;
          animation: engineFlowDraw 5.8s ease-in-out infinite;
        }

        .engine-flow-preview path:nth-child(2) {
          animation-delay: 620ms;
          opacity: 0.72;
        }

        .engine-flow-preview path:nth-child(3) {
          animation-delay: 1180ms;
          opacity: 0.52;
        }

        .match-engine-table {
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          background: rgba(0,0,0,0.24);
          overflow: hidden;
        }

        .home-final {
          padding: 0 0 96px;
          background:
            radial-gradient(ellipse 72% 36% at 50% 0%, rgba(129,74,200,0.14), transparent 72%),
            #000000;
        }

        .home-final-panel {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.74fr);
          gap: clamp(24px, 5vw, 56px);
          align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(129,74,200,0.25), rgba(129,74,200,0.07) 44%, transparent),
            radial-gradient(ellipse 85% 58% at 50% 0%, rgba(129,74,200,0.45), transparent 70%),
            #0d0d0d;
          padding: clamp(48px, 8vw, 88px) 24px;
          text-align: left;
        }

        .home-final-panel::before {
          content: "";
          position: absolute;
          z-index: 0;
          left: 50%;
          top: 0;
          width: 2px;
          height: 96px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #df7afe, transparent);
          pointer-events: none;
        }

        .home-final-panel h2 {
          position: relative;
          margin: 0;
          max-width: 820px;
          color: #ffffff;
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 0.98;
        }

        .home-final-panel p {
          position: relative;
          margin: 22px 0 0;
          max-width: 660px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        .home-final-copy {
          position: relative;
          z-index: 2;
        }

        .match-output-preview {
          position: relative;
          z-index: 2;
        }

        .match-output-card {
          position: relative;
          overflow: hidden;
          min-height: 390px;
          border: 1px solid rgba(223,122,254,0.24);
          border-radius: 22px;
          background:
            radial-gradient(ellipse 80% 54% at 50% 100%, rgba(129,74,200,0.24), transparent 72%),
            rgba(255,255,255,0.04);
          padding: 20px;
        }

        .match-output-card::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -80px;
          width: 240px;
          height: 140px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(223,122,254,0.52), transparent 70%);
          filter: blur(10px);
          opacity: 0.44;
        }

        .match-output-header {
          position: relative;
          display: flex;
          gap: 7px;
        }

        .match-output-header span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
        }

        .match-output-card p {
          position: relative;
          margin-top: 24px;
          color: rgba(223,122,254,0.84);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .match-output-blueprint {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 190px;
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .match-output-blueprint svg {
          width: min(260px, 86%);
          height: auto;
        }

        .match-output-blueprint path,
        .match-output-blueprint circle {
          fill: none;
          stroke: rgba(223,122,254,0.74);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 7px rgba(223,122,254,0.36));
        }

        .match-output-blueprint circle {
          fill: rgba(0,0,0,0.5);
          animation: outputNodePulse 3.2s ease-in-out infinite;
        }

        .match-output-lines {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .match-output-lines span {
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
        }

        .match-output-lines span:nth-child(1) {
          width: 86%;
        }

        .match-output-lines span:nth-child(2) {
          width: 68%;
        }

        .match-output-lines span:nth-child(3) {
          width: 76%;
        }

        @keyframes engineFlowDraw {
          0%   { stroke-dashoffset: 420; opacity: 0; }
          18%  { opacity: 0.85; }
          58%  { stroke-dashoffset: 0; opacity: 0.55; }
          100% { stroke-dashoffset: -420; opacity: 0; }
        }

        @keyframes outputNodePulse {
          0%, 100% { opacity: 0.68; transform: scale(1); transform-origin: center; }
          50%      { opacity: 1; transform: scale(1.08); transform-origin: center; }
        }

        @media (max-width: 1080px) {
          .home-hero-grid,
          .principles-head,
          .home-final-panel {
            grid-template-columns: 1fr;
          }

          .home-hero-copy {
            padding-bottom: 0;
            text-align: center;
          }

          .home-hero-body,
          .home-cta-row {
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
          }

          .homepage-constellation {
            min-height: 460px;
          }

          .home-final-panel,
          .home-final-panel p {
            text-align: center;
          }

          .home-final-panel p,
          .home-final-panel h2 {
            margin-left: auto;
            margin-right: auto;
          }

        }

        @media (max-width: 720px) {
          .home-shell {
            width: min(100% - 24px, 1180px);
          }

          .home-hero {
            min-height: auto;
            padding: 40px 0 52px;
          }

          .home-hero-title {
            font-size: clamp(42px, 13vw, 62px);
            line-height: 1;
          }

          .home-hero-body {
            font-size: 15px;
          }

          .home-cta-primary,
          .home-cta-secondary {
            width: 100%;
          }

          .homepage-constellation {
            min-height: 360px;
            border-radius: 22px;
          }

          .constellation-label,
          .constellation-chip {
            padding: 7px 10px;
            font-size: 11px;
          }

          .constellation-core {
            width: 76px;
            height: 76px;
          }

          .constellation-core img {
            width: 48px;
            height: auto;
          }

          .constellation-match-label {
            top: calc(50% + 54px);
            font-size: 14px;
          }

          .table-proof-grid {
            grid-template-columns: 1fr;
          }

          .table-proof {
            border-radius: 18px;
          }

          .engine-status-bar {
            grid-template-columns: 1fr;
          }

          .engine-status-live {
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }

          .engine-flow-preview svg {
            height: 88px;
          }

          .match-engine-frame {
            padding: 10px;
            border-radius: 22px;
          }

          .match-engine-table {
            border-radius: 16px;
          }

          .home-final-panel {
            border-radius: 22px;
          }

          .match-output-card {
            min-height: 320px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-scroll-progress {
            display: none;
          }

          .engine-flow-preview path,
          .match-output-blueprint circle {
            animation: none !important;
          }

          .engine-flow-preview path {
            stroke-dasharray: none;
            opacity: 0.55;
          }
        }
      ` }} />

      <HomeSignalField />

      <section className="home-hero">
        <div className="home-hero-noise" aria-hidden="true" />
        <div className="home-shell home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-badge">
              <span className="home-badge-dot" />
              AI Match Engine
            </div>
            <h1 className="home-hero-title">
              Find Your Perfect <span>AI Match</span>
            </h1>
            <p className="home-hero-body">
              Explore AI tools for free, get personalized recommendations, or work with us to design and implement the right AI stack for your business.
            </p>
            <div className="home-cta-row">
              <Link href="/assessment" className="home-cta-primary">
                Start Free AI Match
              </Link>
            </div>
          </div>

          <HomepageConstellation />
        </div>
      </section>


      <section id="match-tools" className="match-table-section">
        <div className="px-4 pb-12">
          <div className="match-table-header">
            <h2 className="home-section-title">
              {tools.length.toLocaleString("en-US")} AI tools. Find what works for you.
            </h2>
            <div className="dir-steps-grid">
              <div className="dir-step">
                <span className="dir-step-num">01</span>
                <p>Select your category and subcategory to narrow your focus.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">02</span>
                <p>Apply filters based on pricing, free plan, API access, and more.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">03</span>
                <p>Compare tools side by side and customize columns as needed.</p>
              </div>
              <div className="dir-step">
                <span className="dir-step-num">04</span>
                <p>Bookmark your top picks and choose the best match for you.</p>
              </div>
            </div>
          </div>
          <MatchEngineFrame toolCount={tools.length}>
            <DirectoryClient tools={tools} categories={categories} categoryMap={categoryMap} />
          </MatchEngineFrame>
        </div>
      </section>


      <section className="home-final">
        <div className="home-shell">
          <div className="home-final-panel">
            <div className="home-final-copy">
              <h2>Skip the spreadsheet. Get your AI stack match in minutes.</h2>
              <p>
                Don&apos;t have time to filter {tools.length.toLocaleString("en-US")} tools, compare columns, and benchmark every option? Answer a few questions and we&apos;ll point you toward the AI stack that fits your workflow, team, budget, goals, industry, and use case.
              </p>
              <div className="home-cta-row">
                <Link href="/assessment" className="home-cta-primary">
                  Start Free AI Match
                </Link>
              </div>
            </div>
            <MatchOutputPreview />
          </div>
        </div>
      </section>
    </div>
  );
}
