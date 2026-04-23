"use client";

type BeforeAfterStackProps = {
  compact?: boolean;
};

const beforeNodes = [
  [13, 24],
  [27, 44],
  [38, 20],
  [48, 56],
  [20, 72],
  [58, 30],
  [72, 62],
  [82, 26],
  [88, 78],
  [34, 84],
  [65, 86],
  [10, 56],
];

const afterNodes = [
  [50, 48],
  [30, 30],
  [70, 32],
  [32, 72],
  [72, 70],
  [50, 84],
];

export default function BeforeAfterStack({ compact = false }: BeforeAfterStackProps) {
  return (
    <div className={`before-after-stack ${compact ? "is-compact" : ""}`} aria-hidden>
      <div className="stack-half">
        <span>Before</span>
        <svg viewBox="0 0 100 100">
          {beforeNodes.map(([x, y], i) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={i % 3 === 0 ? 3.5 : 2.7} />
          ))}
        </svg>
      </div>
      <div className="stack-half is-after">
        <span>After</span>
        <svg viewBox="0 0 100 100">
          <path d="M50 48 L30 30 L32 72 L50 84 L72 70 L70 32 Z" />
          <path d="M30 30 L72 70 M70 32 L32 72 M50 48 L50 84" />
          {afterNodes.map(([x, y], i) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={i === 0 ? 5 : 3.6} />
          ))}
        </svg>
      </div>
    </div>
  );
}
