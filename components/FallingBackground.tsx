"use client";

import { Snowflake } from "lucide-react";

const COLORS = ["#e81ccd", "#00e64d"];

// Deterministic pseudo-random spread so server and client render identically (no hydration mismatch).
const ITEMS = Array.from({ length: 22 }).map((_, i) => {
  const Icon = Snowflake;
  const color = COLORS[i % COLORS.length];
  const left = (i * 37 + 5) % 100;
  const size = 18 + ((i * 13) % 22);
  const duration = 16 + ((i * 7) % 14);
  const delay = -((i * 3.3) % duration);
  const drift = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 10));

  return { id: i, Icon, color, left, size, duration, delay, drift };
});

export default function FallingBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
    >
      {ITEMS.map(({ id, Icon, color, left, size, duration, delay, drift }) => (
        <div
          key={id}
          className="bg-fall-item"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            ["--drift" as string]: `${drift}px`,
          }}
        >
          <Icon
            size={size}
            style={{ color }}
            className="bg-sparkle"
          />
        </div>
      ))}
    </div>
  );
}
