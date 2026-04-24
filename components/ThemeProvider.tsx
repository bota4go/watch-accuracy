"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  type UiThemeId,
  DEFAULT_UI_THEME,
  parseUiThemeId,
  readGuestThemeFromStorage,
  writeGuestThemeToStorage,
} from "@/lib/ui-themes";

type Ctx = {
  theme: UiThemeId;
  setTheme: (t: UiThemeId) => Promise<void>;
  ready: boolean;
};

const ThemeContext = createContext<Ctx | null>(null);

function applyDomTheme(id: UiThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-ui-theme", id);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [theme, setThemeState] = useState<UiThemeId>(DEFAULT_UI_THEME);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  useLayoutEffect(() => {
    const g = readGuestThemeFromStorage();
    if (g) {
      setThemeState(g);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      const g = readGuestThemeFromStorage() ?? DEFAULT_UI_THEME;
      setThemeState(g);
      setReady(true);
      return;
    }
    (async () => {
      try {
        const r = await fetch("/api/user/preferences", { credentials: "include" });
        if (r.ok) {
          const j = (await r.json()) as { uiTheme?: string };
          const t = parseUiThemeId(j.uiTheme);
          setThemeState(t);
          writeGuestThemeToStorage(t);
        } else {
          setThemeState(readGuestThemeFromStorage() ?? DEFAULT_UI_THEME);
        }
      } catch {
        setThemeState(readGuestThemeFromStorage() ?? DEFAULT_UI_THEME);
      } finally {
        setReady(true);
      }
    })();
  }, [status]);

  const setTheme = useCallback(
    async (t: UiThemeId) => {
      setThemeState(t);
      applyDomTheme(t);
      writeGuestThemeToStorage(t);
      if (session?.user) {
        try {
          await fetch("/api/user/preferences", {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uiTheme: t }),
          });
        } catch {
          /* still applied locally */
        }
      }
    },
    [session?.user]
  );

  const value = useMemo(() => ({ theme, setTheme, ready }), [theme, setTheme, ready]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const c = useContext(ThemeContext);
  if (!c) {
    throw new Error("useAppTheme must be used under ThemeProvider");
  }
  return c;
}

/** Safe when provider might be missing (e.g. storybook) */
export function useAppThemeOptional() {
  return useContext(ThemeContext);
}
