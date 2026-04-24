"use client";

import { useLayoutEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SyncEntry } from "@/lib/types";
import { useAppThemeOptional } from "@/components/ThemeProvider";

const FALL = {
  line: "#22d3ee",
  dot: "#e879f9",
  ref: "#22d3ee",
  grid: "#64748b",
  tipBg: "#070b1a",
  tipBorder: "#0d1630",
  label: "#e879f9",
  fg: "#c8d8f0",
};

type Point = { t: number; label: string; offset: number; full: string };

function readChartVars() {
  if (typeof document === "undefined") return null;
  const s = getComputedStyle(document.documentElement);
  return {
    line: s.getPropertyValue("--chart-line").trim() || FALL.line,
    dot: s.getPropertyValue("--chart-dot").trim() || FALL.dot,
    ref: s.getPropertyValue("--chart-ref").trim() || FALL.ref,
    grid: s.getPropertyValue("--chart-grid").trim() || FALL.grid,
    tipBg: s.getPropertyValue("--chart-tooltip-bg").trim() || FALL.tipBg,
    tipBorder: s.getPropertyValue("--chart-tooltip-border").trim() || FALL.tipBorder,
    label: s.getPropertyValue("--app-a2").trim() || FALL.label,
    fg: s.getPropertyValue("--app-fg").trim() || FALL.fg,
  };
}

export function DriftChart({ syncs }: { syncs: SyncEntry[] }) {
  const theme = useAppThemeOptional();
  const [c, setC] = useState(FALL);

  useLayoutEffect(() => {
    setC(readChartVars() ?? FALL);
  }, [theme?.theme, theme?.ready]);

  if (syncs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-app-line bg-app-card/80 text-xs tracking-widest text-app-muted">
        NO SYNC DATA YET
      </div>
    );
  }

  const data: Point[] = syncs
    .map((s) => {
      const d = new Date(s.at);
      return {
        t: d.getTime(),
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        offset: s.offsetSec,
        full: d.toLocaleString(),
      };
    })
    .sort((a, b) => a.t - b.t);

  const family =
    (typeof document !== "undefined" &&
      getComputedStyle(document.documentElement).getPropertyValue("--app-font").trim().split(",")[0]) ||
    "Share Tech Mono";
  const tickFont = family.replace(/['"]/g, "");

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={c.grid} strokeOpacity={0.2} />
          <XAxis
            dataKey="label"
            tick={{ fill: c.grid, fontSize: 10, fontFamily: tickFont }}
            stroke={c.grid}
            strokeOpacity={0.3}
          />
          <YAxis
            tick={{ fill: c.grid, fontSize: 10, fontFamily: tickFont }}
            stroke={c.grid}
            strokeOpacity={0.3}
            width={40}
            tickFormatter={(v) => `${v}s`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: c.tipBg,
              border: `1px solid ${c.tipBorder}`,
              borderRadius: "8px",
              fontSize: 12,
              color: c.fg,
            }}
            labelStyle={{ color: c.label }}
            formatter={(value) => {
              const n = Number(value);
              if (Number.isNaN(n)) return ["", ""];
              return [`${n > 0 ? "+" : ""}${n.toFixed(1)} s`, "Offset"];
            }}
            labelFormatter={(_label, p) => {
              const pl = p?.[0] as { payload: Point } | undefined;
              return pl?.payload?.full ?? "";
            }}
          />
          <ReferenceLine y={0} stroke={c.ref} strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="offset"
            stroke={c.line}
            strokeWidth={2}
            dot={{ fill: c.dot, r: 3 }}
            activeDot={{ r: 5, fill: c.dot, stroke: c.line }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
