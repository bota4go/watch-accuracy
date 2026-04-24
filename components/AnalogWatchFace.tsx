"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
/** SVG clock: 0° = 3 o'clock, so 12 o'clock = -90°. */
function handsFromTime(timeMs: number) {
  const d = new Date(timeMs);
  const ms = d.getMilliseconds();
  const s = d.getSeconds() + ms / 1000;
  const m = d.getMinutes() + s / 60;
  const h = (d.getHours() % 12) + m / 60;
  return {
    hourDeg: -90 + h * 30, // 30° per hour
    minuteDeg: -90 + m * 6,
    secondDeg: -90 + s * 6,
  };
}

const CX = 100;
const CY = 100;
const R = 88;

export function AnalogWatchFace({
  timeMs,
  label,
  subLabel,
  tone = "cyan",
  showSecondHand = true,
}: {
  timeMs: number;
  label: string;
  subLabel?: string;
  tone?: "cyan" | "fuchsia";
  showSecondHand?: boolean;
}) {
  const { hourDeg, minuteDeg, secondDeg } = useMemo(
    () => handsFromTime(timeMs),
    [timeMs]
  );

  const dVar = tone === "cyan" ? "var(--dial-1)" : "var(--dial-2)";

  const ringColor = { stroke: tone === "cyan" ? "var(--dial-1)" : "var(--dial-2)" } as const;

  const tickStroke = (major: boolean) => ({
    stroke: major ? "var(--dial-tick)" : "var(--dial-tick-weak)",
  });

  const glowStyle = {
    filter: `drop-shadow(0 0 6px ${dVar}) drop-shadow(0 0 10px color-mix(in srgb, ${dVar} 50%, transparent))`,
  } as const;

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const ang = (i / 12) * 360 - 90;
    const rad = (ang * Math.PI) / 180;
    const inner = 72;
    const outer = 82;
    const major = i % 3 === 0;
    return (
      <line
        key={i}
        x1={CX + inner * Math.cos(rad)}
        y1={CY + inner * Math.sin(rad)}
        x2={CX + outer * Math.cos(rad)}
        y2={CY + outer * Math.sin(rad)}
        style={tickStroke(major)}
        strokeWidth={major ? 2.5 : 1}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-2" style={glowStyle}>
      <p
        className={cn(
          "text-center text-[10px] font-bold uppercase tracking-[0.25em]",
          tone === "cyan" ? "text-app-a1/85" : "text-app-a2/85"
        )}
      >
        {label}
        {subLabel && (
          <span className="ml-1 font-normal text-app-muted/90 normal-case tracking-normal">{subLabel}</span>
        )}
      </p>
      <div className="relative h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]">
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          role="img"
          aria-label={`Analog clock, ${label}`}
        >
          <defs>
            <radialGradient id={`face-${tone}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tone === "cyan" ? "#0a1a1f" : "#1a0a1c"} />
              <stop offset="100%" stopColor="#03040a" />
            </radialGradient>
          </defs>
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill={`url(#face-${tone})`}
            style={ringColor}
            strokeWidth={2}
            className="opacity-90"
          />
          {ticks}
          <text
            x={100}
            y={28}
            textAnchor="middle"
            className="fill-app-muted/60 text-[11px] font-mono"
          >
            12
          </text>
          <text
            x={180}
            y={106}
            textAnchor="middle"
            className="fill-app-muted/60 text-[11px] font-mono"
          >
            3
          </text>
          <text
            x={100}
            y={180}
            textAnchor="middle"
            className="fill-app-muted/60 text-[11px] font-mono"
          >
            6
          </text>
          <text
            x={20}
            y={106}
            textAnchor="middle"
            className="fill-app-muted/60 text-[11px] font-mono"
          >
            9
          </text>

          <line
            x1={CX}
            y1={CY}
            x2={CX + 32}
            y2={CY}
            className="stroke-amber-100/80"
            strokeWidth={4.5}
            strokeLinecap="round"
            transform={`rotate(${hourDeg} ${CX} ${CY})`}
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX + 50}
            y2={CY}
            className="stroke-slate-200/90"
            strokeWidth={2.5}
            strokeLinecap="round"
            transform={`rotate(${minuteDeg} ${CX} ${CY})`}
          />
          {showSecondHand && (
            <line
              x1={CX}
              y1={CY}
              x2={CX + 60}
              y2={CY}
              style={{ stroke: dVar }}
              strokeWidth={1.5}
              strokeLinecap="round"
              transform={`rotate(${secondDeg} ${CX} ${CY})`}
            />
          )}
          <circle
            cx={CX}
            cy={CY}
            r={5}
            style={{ fill: dVar }}
            className="drop-shadow"
          />
        </svg>
      </div>
      <p className="font-mono text-[10px] tabular-nums text-app-muted sm:text-xs">
        {new Date(timeMs).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
    </div>
  );
}
