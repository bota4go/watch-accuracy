"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import type { WatchRecord } from "./types";

const FETCH_MS = 20000;

export function useWatches() {
  const { data: session, status } = useSession();
  const [watches, setWatches] = useState<WatchRecord[]>([]);
  /** False until session is resolved and (if authed) first list fetch finished or failed. */
  const [dataReady, setDataReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isAuthed = status === "authenticated";

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setLoadError(null);
    const r = await fetch("/api/watches", { credentials: "include", signal });
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
    if (status === "loading") {
      setDataReady(false);
      return;
    }
    if (status === "unauthenticated") {
      setWatches([]);
      setLoadError(null);
      setDataReady(true);
      return;
    }

    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), FETCH_MS);
    setDataReady(false);
    setLoadError(null);

    (async () => {
      try {
        await refetch(ac.signal);
        clearTimeout(to);
      } catch (e) {
        clearTimeout(to);
        const err = e as { name?: string };
        if (err.name === "AbortError") {
          setLoadError("Loading watches timed out. On Vercel, set DATABASE_URL and run prisma against it.");
        } else {
          setLoadError("Could not load watches.");
        }
        setWatches([]);
      } finally {
        setDataReady(true);
      }
    })();

    return () => {
      clearTimeout(to);
      ac.abort();
    };
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
    ready: status !== "loading" && dataReady,
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
