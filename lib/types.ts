export interface SyncEntry {
  id: string;
  at: string; // ISO
  /** Positive = watch shows ahead of true (atomic) time */
  offsetSec: number;
}

export interface WatchRecord {
  id: string;
  name: string;
  createdAt: string;
  syncs: SyncEntry[];
}
