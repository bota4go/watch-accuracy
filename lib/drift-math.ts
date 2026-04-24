import type { SyncEntry } from "./types";

export interface DriftSample {
  from: SyncEntry;
  to: SyncEntry;
  daysBetween: number;
  /** (offsetTo - offsetFrom) / days — how much offset change per day */
  secPerDay: number;
}

const MS_DAY = 86_400_000;

export function buildDriftSamples(sortedSyncs: SyncEntry[]): DriftSample[] {
  if (sortedSyncs.length < 2) return [];
  const out: DriftSample[] = [];
  for (let i = 1; i < sortedSyncs.length; i++) {
    const from = sortedSyncs[i - 1]!;
    const to = sortedSyncs[i]!;
    const t0 = new Date(from.at).getTime();
    const t1 = new Date(to.at).getTime();
    if (t1 <= t0) continue;
    const daysBetween = (t1 - t0) / MS_DAY;
    if (daysBetween < 1e-6) continue;
    const secPerDay = (to.offsetSec - from.offsetSec) / daysBetween;
    out.push({ from, to, daysBetween, secPerDay });
  }
  return out;
}

/** Average absolute daily drift in sec/day (how "wrong" the watch gets per day on average). */
export function meanAbsDailyDriftSec(samples: DriftSample[]): number | null {
  if (samples.length === 0) return null;
  const sum = samples.reduce((a, s) => a + Math.abs(s.secPerDay), 0);
  return sum / samples.length;
}

/** Mean signed rate: positive = watch gains time on average. */
export function meanDailyDriftSec(samples: DriftSample[]): number | null {
  if (samples.length === 0) return null;
  return samples.reduce((a, s) => a + s.secPerDay, 0) / samples.length;
}

export function formatSecPerDay(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1) return `${v >= 0 ? "+" : ""}${v.toFixed(2)} s/d`;
  if (abs >= 0.001) return `${v >= 0 ? "+" : ""}${(v * 1000).toFixed(1)} ms/d`;
  return `${(v * 1e6).toFixed(0)} µs/d`;
}

export function daysBetweenSyncsHint(syncs: SyncEntry[]): string | null {
  if (syncs.length < 1) return null;
  if (syncs.length === 1) return "Add a second sync later to measure daily drift.";
  const last = syncs[syncs.length - 1]!;
  const prev = syncs[syncs.length - 2]!;
  const d = (new Date(last.at).getTime() - new Date(prev.at).getTime()) / MS_DAY;
  return `Last interval: ${d < 1 ? d.toFixed(2) : d.toFixed(1)} day(s) between syncs.`;
}
