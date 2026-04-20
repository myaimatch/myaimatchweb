"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Tools = "small" | "medium" | "large";
type Workflows = "one" | "several" | "many";
type Team = "solo" | "small" | "growing";

const toolOptions: Array<{ id: Tools; label: string; score: number }> = [
  { id: "small", label: "1-3 tools", score: 1 },
  { id: "medium", label: "4-8 tools", score: 2 },
  { id: "large", label: "9+ tools", score: 3 },
];

const workflowOptions: Array<{ id: Workflows; label: string; score: number }> = [
  { id: "one", label: "1 workflow", score: 1 },
  { id: "several", label: "2-4 workflows", score: 2 },
  { id: "many", label: "5+ workflows", score: 3 },
];

const teamOptions: Array<{ id: Team; label: string; score: number }> = [
  { id: "solo", label: "Solo", score: 1 },
  { id: "small", label: "2-10", score: 2 },
  { id: "growing", label: "10+", score: 3 },
];

export default function StackCalculator({ ctaHref }: { ctaHref: string }) {
  const [tools, setTools] = useState<Tools>("medium");
  const [workflows, setWorkflows] = useState<Workflows>("several");
  const [team, setTeam] = useState<Team>("small");

  const result = useMemo(() => {
    const score =
      toolOptions.find((o) => o.id === tools)!.score +
      workflowOptions.find((o) => o.id === workflows)!.score +
      teamOptions.find((o) => o.id === team)!.score;

    if (score <= 4) {
      return {
        scope: "Focused setup",
        complexity: "Low integration risk",
        timeline: "About 1-2 weeks",
        body: "Best for a single operator or tight workflow where speed matters more than a broad rollout.",
      };
    }
    if (score <= 7) {
      return {
        scope: "Core operating stack",
        complexity: "Moderate build complexity",
        timeline: "About 2-4 weeks",
        body: "Best for teams that need shared tools, automations, documentation, and a clean handoff.",
      };
    }
    return {
      scope: "Multi-workflow rollout",
      complexity: "Higher coordination complexity",
      timeline: "Scoped in phases",
      body: "Best when several teams, agents, integrations, or adoption paths need to be sequenced carefully.",
    };
  }, [team, tools, workflows]);

  return (
    <section className="impl-shell py-20 md:py-28">
      <div className="stack-calculator">
        <div className="stack-calculator-copy">
          <p className="impl-label">Stack calculator</p>
          <h2 className="impl-section-title">Get a feel for build shape before the call.</h2>
          <p className="impl-section-body">
            This is directional, not a quote. It helps us talk about scope in plain language.
          </p>
        </div>
        <div className="stack-calculator-controls">
          <OptionGroup label="Tools to configure" value={tools} options={toolOptions} onChange={setTools} />
          <OptionGroup
            label="Workflows or agents"
            value={workflows}
            options={workflowOptions}
            onChange={setWorkflows}
          />
          <OptionGroup label="Team size" value={team} options={teamOptions} onChange={setTeam} />
        </div>
        <div className="stack-calculator-result" aria-live="polite">
          <p>Likely build shape</p>
          <h3>{result.scope}</h3>
          <div>
            <span>{result.complexity}</span>
            <span>{result.timeline}</span>
          </div>
          <p>{result.body}</p>
          <Link className="impl-cta-primary" href={ctaHref}>
            Book a scoping call
          </Link>
        </div>
      </div>
    </section>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="calculator-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={value === option.id ? "is-active" : ""}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
