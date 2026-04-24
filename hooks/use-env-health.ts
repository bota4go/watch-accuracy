"use client";

import { useEffect, useState } from "react";

export type EnvHealth = {
  google: boolean;
  database: boolean;
  nextAuth: boolean;
  nextAuthUrl: string | null;
} | null;

export function useEnvHealth() {
  const [h, setH] = useState<EnvHealth>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setH(data);
      })
      .catch(() => {
        if (!cancelled) setH(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return h;
}
