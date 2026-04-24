"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import type { WatchRecord } from "./types";

export function useWatches() {
  const { data: session, status } = useSession();
  const [watches, setWatches] = useState<WatchRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isAuthed = status === "authenticated";

  const refetch = useCallback(async () => {
    setLoadError(null);
    const r = await fetch("/api/watches", { credentials: "include" });
    if (r.status === 401) {
      setWatches([]);
      return;
    }
    if (!r.ok) {
      setLoadError("Could not load watches.");
      setWatches([]);
      return;
    }
    const data = (await r.json()) as WatchRecord[];
    setWatches(data);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setWatches([]);
      setLoadError(null);
      setReady(true);
      return;
    }
    setReady(false);
    void refetch().finally(() => setReady(true));
  }, [status, refetch]);

  const registerWatch = useCallback(
    async (name: string): Promise<string> => {
      const r = await fetch("/api/watches", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Unnamed" }),
      });
      if (r.status === 401) throw new Error("Sign in required");
      if (!r.ok) throw new Error("Could not create watch");
      const w = (await r.json()) as WatchRecord;
      setWatches((prev) => [w, ...prev]);
      return w.id;
    },
    []
  );

  const removeWatch = useCallback(async (id: string) => {
    const r = await fetch(`/api/watches/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.status === 401) return;
    if (r.status === 404) return;
    if (!r.ok) return;
    setWatches((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const recordSync = useCallback(
    async (watchId: string, offsetSec: number) => {
      const r = await fetch(`/api/watches/${watchId}/syncs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offsetSec }),
      });
      if (r.status === 401) return;
      if (!r.ok) return;
      const updated = (await r.json()) as WatchRecord;
      setWatches((prev) => prev.map((w) => (w.id === watchId ? updated : w)));
    },
    []
  );

  return {
    ready: ready && status !== "loading",
    status,
    isAuthed,
    user: session?.user,
    loadError,
    watches,
    registerWatch,
    removeWatch,
    recordSync,
  };
}
