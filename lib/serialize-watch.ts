import type { Watch, SyncEntry } from "@prisma/client";
import type { WatchRecord } from "./types";

type WatchWithSyncs = Watch & { syncs: SyncEntry[] };

export function serializeWatch(w: WatchWithSyncs): WatchRecord {
  return {
    id: w.id,
    name: w.name,
    createdAt: w.createdAt.toISOString(),
    syncs: w.syncs.map((s) => ({
      id: s.id,
      at: s.at.toISOString(),
      offsetSec: s.offsetSec,
    })),
  };
}
