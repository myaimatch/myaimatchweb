"use client";

import { useState } from "react";
import Link from "next/link";

const modes = [
  {
    id: "monthly",
    label: "Monthly",
    rhythm: "2 focused calls",
    title: "Light-touch momentum",
    body: "Best when your team is already moving and needs a senior AI check-in to prevent drift.",
  },
  {
    id: "weekly",
    label: "Weekly",
    rhythm: "4 calls + async",
    title: "Active operating cadence",
    body: "Best when adoption, training, and workflow improvements need a consistent weekly rhythm.",
  },
  {
    id: "dedicated",
    label: "Dedicated",
    rhythm: "Always-on support",
    title: "Fractional AI lead",
    body: "Best when AI is now part of operations and you want one clear owner for tool decisions.",
  },
];

export default function CadenceSelector({ ctaHref }: { ctaHref: string }) {
  const [active, setActive] = useState(1);
  const mode = modes[active];

  return (
    <section className="coaching-shell py-20 md:py-28">
      <div className="cadence-selector">
        <div>
          <p className="coaching-label">Cadence</p>
          <h2 className="coaching-section-title">Choose the rhythm, then we scope the details.</h2>
          <p className="coaching-section-body">
            No public dollar menu here. The useful question is how close we need to stay to your team.
          </p>
        </div>
        <div className="cadence-options" role="tablist" aria-label="Fractional AI lead cadence">
          {modes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === active ? "is-active" : ""}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={index === active}
            >
              <span>{item.label}</span>
              {item.rhythm}
            </button>
          ))}
        </div>
        <div className="cadence-output" role="tabpanel">
          <div className={`cadence-pulses cadence-pulses--${mode.id}`} aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <p>{mode.rhythm}</p>
          <h3>{mode.title}</h3>
          <span>{mode.body}</span>
          <Link className="coaching-cta-primary" href={ctaHref}>
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}
