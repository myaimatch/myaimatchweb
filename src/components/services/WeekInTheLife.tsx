"use client";

import { useState } from "react";

const days = [
  {
    day: "Mon",
    time: "10:00",
    title: "Sparring call",
    body: "We pressure-test one workflow and decide what gets improved this week.",
  },
  {
    day: "Tue",
    time: "Async",
    title: "Prompt review",
    body: "Your team drops a draft workflow. We tighten the instruction chain and failure checks.",
  },
  {
    day: "Wed",
    time: "Slack",
    title: "Stack support",
    body: "A teammate gets blocked. We answer inside the operating context, not a ticket queue.",
  },
  {
    day: "Thu",
    time: "Tool scan",
    title: "New option vetted",
    body: "We test a new tool against your use case and only send it if it beats what you have.",
  },
  {
    day: "Fri",
    time: "Training",
    title: "Team enablement",
    body: "One short walkthrough turns the week's improvements into something the team can repeat.",
  },
  {
    day: "Sat",
    time: "Quiet",
    title: "Monitoring",
    body: "The stack keeps running. Notes and weird edge cases roll into the next improvement cycle.",
  },
  {
    day: "Sun",
    time: "Prep",
    title: "Next-week focus",
    body: "We turn signal from the week into the next small set of decisions.",
  },
];

export default function WeekInTheLife() {
  const [active, setActive] = useState(0);

  return (
    <section className="coaching-shell py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="coaching-label">A week in the life</p>
        <h2 className="coaching-section-title">Support with a rhythm your team can feel.</h2>
        <p className="coaching-section-body">
          Fractional does not mean vague. It means the right touchpoints at the right moments.
        </p>
      </div>
      <div className="week-life">
        <div className="week-life-days" role="tablist" aria-label="Week in the life">
          {days.map((item, index) => (
            <button
              key={item.day}
              type="button"
              className={index === active ? "is-active" : ""}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={index === active}
            >
              <span>{item.day}</span>
              {item.time}
            </button>
          ))}
        </div>
        <div className="week-life-panel" role="tabpanel">
          <p>{days[active].day} · {days[active].time}</p>
          <h3>{days[active].title}</h3>
          <span>{days[active].body}</span>
        </div>
      </div>
    </section>
  );
}
