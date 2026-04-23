"use client";

import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const weeks = [
  {
    week: "Week 1",
    title: "Map the build surface",
    body: "We confirm accounts, workflows, permissions, edge cases, and what has to ship first.",
    output: "Build spec + access checklist",
  },
  {
    week: "Week 2",
    title: "Configure the core tools",
    body: "Tools get installed, connected, and tuned around your actual operating workflow.",
    output: "Working AI setup foundation",
  },
  {
    week: "Week 3",
    title: "Automate the handoffs",
    body: "Agents, triggers, routing, and data handoffs move from prototype to usable system.",
    output: "Tested workflows + QA notes",
  },
  {
    week: "Week 4",
    title: "Train, document, launch",
    body: "Your team gets the playbook, walkthroughs, and the confidence to run your AI setup.",
    output: "Launch handoff + Loom library",
  },
];

export default function BuildTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || window.matchMedia("(max-width: 900px)").matches) return;

    let cleanup = () => {};

    async function setup() {
      const gsapModule = await import("gsap");
      const scrollModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top+=96",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          setActiveIndex(Math.min(weeks.length - 1, Math.floor(self.progress * weeks.length)));
        },
      });

      cleanup = () => trigger.kill();
    }

    setup();
    return () => cleanup();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="service-shell build-timeline-section py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="impl-label">How a build goes</p>
        <h2 className="impl-section-title">Four weeks from roadmap to working system.</h2>
        <p className="impl-section-body">
          The exact shape depends on your AI setup, but the rhythm is simple: scope, build, test, train.
        </p>
      </div>
      <div className="build-timeline-stage">
        <div className="build-progress" aria-hidden>
          <span style={{ width: `${((activeIndex + 1) / weeks.length) * 100}%` }} />
        </div>
        <div className="build-week-rail" role="tablist" aria-label="Build timeline weeks">
          {weeks.map((item, index) => (
            <button
              key={item.week}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={index === activeIndex}
            >
              <span>{item.week}</span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="build-week-panel">
          <div>
            <p className="build-week-kicker">{weeks[activeIndex].week}</p>
            <h3>{weeks[activeIndex].title}</h3>
            <p>{weeks[activeIndex].body}</p>
            <strong>{weeks[activeIndex].output}</strong>
          </div>
          <div className="build-week-mockup" aria-hidden>
            <div className="mockup-top" />
            <div className="mockup-flow">
              <span />
              <span />
              <span />
            </div>
            <div className="mockup-lines">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
