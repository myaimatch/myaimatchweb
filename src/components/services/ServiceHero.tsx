import Link from "next/link";
import type { ReactNode } from "react";

type ServiceHeroProps = {
  label: string;
  title: string;
  highlightedTitle: string;
  body: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  metrics?: Array<{
    value: ReactNode;
    label: string;
  }>;
  note?: string;
  visual?: ReactNode;
  variant?: "strategy" | "implementation" | "lead";
};

export default function ServiceHero({
  label,
  title,
  highlightedTitle,
  body,
  primaryCta,
  secondaryCta,
  metrics = [],
  note,
  visual,
  variant = "strategy",
}: ServiceHeroProps) {
  return (
    <section className={`service-hero service-hero--${variant}`}>
      {visual ? <div className="service-hero-visual">{visual}</div> : null}
      <div className="service-hero-shell relative z-10 text-center">
        <p className="services-label">{label}</p>
        <h1 className="service-hero-title shimmer-active">
          {title} <span>{highlightedTitle}</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.75] text-white/65 md:text-lg">
          {body}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link className="services-cta-primary" href={primaryCta.href}>
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link className="services-cta-secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
        {note ? <p className="mt-6 text-sm leading-6 text-white/40">{note}</p> : null}
        {metrics.length ? (
          <div className="service-hero-metrics" aria-label="Trust signals">
            {metrics.map((metric, index) => (
              <span key={metric.label} className="service-hero-metric">
                <strong>{metric.value}</strong> {metric.label}
                {index < metrics.length - 1 ? (
                  <span className="service-hero-metrics-divider" aria-hidden>
                    •
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
