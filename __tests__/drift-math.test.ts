import { describe, it, expect } from "vitest";
import { buildDriftSamples, meanAbsDailyDriftSec, meanDailyDriftSec } from "@/lib/drift-math";
import type { SyncEntry } from "@/lib/types";

const d = (iso: string) => iso;

function entry(at: string, offsetSec: number): SyncEntry {
  return { id: "x", at, offsetSec };
}

describe("buildDriftSamples", () => {
  it("returns empty for <2 syncs", () => {
    expect(buildDriftSamples([entry(d("2025-01-01T12:00:00Z"), 0)])).toEqual([]);
  });

  it("computes sec/day between two syncs", () => {
    const s = buildDriftSamples([
      entry(d("2025-01-01T12:00:00Z"), 0),
      entry(d("2025-01-02T12:00:00Z"), 1), // +1s over 1 day
    ]);
    expect(s).toHaveLength(1);
    expect(s[0]!.secPerDay).toBeCloseTo(1, 5);
  });

  it("handles multi-day span", () => {
    const s = buildDriftSamples([
      entry(d("2025-01-01T00:00:00Z"), 0),
      entry(d("2025-01-04T00:00:00Z"), 3), // 3s over 3 days
    ]);
    expect(s[0]!.secPerDay).toBeCloseTo(1, 5);
  });
});

describe("averages", () => {
  it("mean abs / mean sign", () => {
    const samples = buildDriftSamples([
      entry(d("2025-01-01T00:00:00Z"), 0),
      entry(d("2025-01-02T00:00:00Z"), 2), // +2 s/d
      entry(d("2025-01-03T00:00:00Z"), 1), // -1 s/d on second segment
    ]);
    // |+2| and |-1| → mean 1.5; signed mean (2 + -1) / 2 = 0.5
    expect(meanAbsDailyDriftSec(samples)).toBeCloseTo(1.5, 5);
    expect(meanDailyDriftSec(samples)).toBeCloseTo(0.5, 5);
  });
});
