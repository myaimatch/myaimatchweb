"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const konami = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function ServicePolish() {
  const pathname = usePathname();
  const isService = pathname?.startsWith("/services/");
  const reduced = usePrefersReducedMotion();
  const [transitioning, setTransitioning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [spiralOpen, setSpiralOpen] = useState(false);

  useEffect(() => {
    if (!isService || reduced) return;
    setTransitioning(true);
    const timeout = window.setTimeout(() => setTransitioning(false), 620);
    return () => window.clearTimeout(timeout);
  }, [isService, pathname, reduced]);

  useEffect(() => {
    setSoundOn(window.localStorage.getItem("myaimatch-service-sound") === "on");
  }, []);

  useEffect(() => {
    if (!isService) return;
    let index = 0;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSpiralOpen(false);
        return;
      }
      const expected = konami[index];
      if (event.key.toLowerCase() === expected.toLowerCase()) {
        index += 1;
        if (index === konami.length) {
          setSpiralOpen(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isService]);

  useEffect(() => {
    if (!isService || !soundOn) return;
    let audioContext: AudioContext | null = null;

    const play = () => {
      audioContext = audioContext ?? new AudioContext();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.frequency.value = 640;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.17);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".services-cta-primary, .services-cta-secondary, .impl-cta-primary, .coaching-cta-primary, .next-service-card")) {
        play();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isService, soundOn]);

  if (!isService) return null;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    window.localStorage.setItem("myaimatch-service-sound", next ? "on" : "off");
  };

  return (
    <>
      <ScrollProgress disabled={reduced} />
      <div className="service-grain" aria-hidden />
      <div className={`service-page-tint ${transitioning ? "is-active" : ""}`} aria-hidden />
      <button type="button" className="service-sound-toggle" onClick={toggleSound} aria-pressed={soundOn}>
        Sound {soundOn ? "on" : "off"}
      </button>
      {spiralOpen ? (
        <div className="service-spiral-overlay" role="dialog" aria-modal="true" aria-label="Fullscreen spiral">
          <SpiralAnimation />
          <button type="button" onClick={() => setSpiralOpen(false)}>
            Close
          </button>
        </div>
      ) : null}
    </>
  );
}

function ScrollProgress({ disabled }: { disabled: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (disabled) return;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [disabled]);

  return <div className="service-scroll-progress" style={{ transform: `scaleX(${disabled ? 0 : progress})` }} aria-hidden />;
}
