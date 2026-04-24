"use client";

import { useEffect, useState } from "react";

/** Returns `Date.now()` on an interval for smooth second hands. */
export function useTick(ms = 32) {
  const [t, setT] = useState(0);
  useEffect(() => {
    setT(Date.now());
    const id = setInterval(() => setT(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
}
