import { useMemo } from "react";

export type Attribute = { key: string; value: number };

interface Props {
  data: Attribute[];
  size?: number;
  onClick?: () => void;
}

export function AttributesRadar({ data, size = 240, onClick }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 28;
  const levels = 4;

  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const r = (d.value / 100) * radius;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        lx: cx + Math.cos(angle) * (radius + 14),
        ly: cy + Math.sin(angle) * (radius + 14),
        ax: cx + Math.cos(angle) * radius,
        ay: cy + Math.sin(angle) * radius,
        ...d,
      };
    });
  }, [data, cx, cy, radius]);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <button
      onClick={onClick}
      className="group block w-full transition-opacity hover:opacity-90"
      aria-label="Open attribute history"
    >
      <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {Array.from({ length: levels }).map((_, i) => {
          const r = (radius * (i + 1)) / levels;
          const ringPts = data.map((_, j) => {
            const a = (Math.PI * 2 * j) / data.length - Math.PI / 2;
            return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
          });
          return (
            <polygon
              key={i}
              points={ringPts.join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}
        {points.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.ax}
            y2={p.ay}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <path
          d={path}
          fill="var(--csarge)"
          fillOpacity="0.3"
          stroke="var(--csarge-active)"
          strokeWidth="1.5"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--csarge-active)" />
        ))}
        {points.map((p, i) => (
          <g key={`l-${i}`}>
            <text
              x={p.lx}
              y={p.ly - 4}
              textAnchor="middle"
              className="fill-[var(--muted-foreground)] font-mono"
              style={{ fontSize: 9, letterSpacing: "0.08em" }}
            >
              {p.key}
            </text>
            <text
              x={p.lx}
              y={p.ly + 7}
              textAnchor="middle"
              className="fill-[var(--foreground)] font-mono"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {p.value}
            </text>
          </g>
        ))}
      </svg>
    </button>
  );
}
