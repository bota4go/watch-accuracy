"use client";

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

const CYAN = "#22d3ee";
const FUCHSIA = "#e879f9";
const AXIS = "#64748b";

type Point = { t: number; label: string; offset: number; full: string };

export function DriftChart({ syncs }: { syncs: SyncEntry[] }) {
  if (syncs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-[#0d1630] bg-[#070b1a]/80 text-xs tracking-widest text-slate-500">
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

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={AXIS} strokeOpacity={0.2} />
          <XAxis
            dataKey="label"
            tick={{ fill: AXIS, fontSize: 10, fontFamily: "Share Tech Mono" }}
            stroke={AXIS}
            strokeOpacity={0.3}
          />
          <YAxis
            tick={{ fill: AXIS, fontSize: 10, fontFamily: "Share Tech Mono" }}
            stroke={AXIS}
            strokeOpacity={0.3}
            width={40}
            tickFormatter={(v) => `${v}s`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#070b1a",
              border: "1px solid #0d1630",
              borderRadius: "8px",
              fontSize: 12,
              color: "#c8d8f0",
            }}
            labelStyle={{ color: FUCHSIA }}
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
          <ReferenceLine y={0} stroke={CYAN} strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="offset"
            stroke={CYAN}
            strokeWidth={2}
            dot={{ fill: FUCHSIA, r: 3 }}
            activeDot={{ r: 5, fill: FUCHSIA, stroke: CYAN }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
