"use client";

import { Palette } from "lucide-react";
import { useAppTheme } from "./ThemeProvider";
import { parseUiThemeId, UI_THEME_OPTIONS } from "@/lib/ui-themes";

export function ThemePicker() {
  const { theme, setTheme, ready } = useAppTheme();
  if (!ready) {
    return (
      <div className="h-8 w-40 animate-pulse rounded border border-app-line/50 bg-app-card" aria-hidden />
    );
  }
  return (
    <label className="flex min-w-0 max-w-full flex-1 items-center gap-1.5 sm:max-w-[min(20rem,100%)] sm:flex-none">
      <Palette className="h-3.5 w-3.5 flex-shrink-0 text-app-muted" aria-hidden />
      <span className="sr-only">Interface theme</span>
      <select
        className="min-w-0 max-w-full flex-1 cursor-pointer appearance-none rounded-lg border border-app-line/80 bg-app-body/50 py-1.5 pl-2 pr-6 text-[10px] font-semibold uppercase tracking-wider text-app-fg/90 focus:border-app-a1/50 focus:outline-none sm:text-xs"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%2394a3b8' d='M0 0h10L5 6z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.4rem center",
        }}
        value={theme}
        onChange={async (e) => {
          await setTheme(parseUiThemeId(e.target.value));
        }}
        aria-label="Choose interface color theme"
      >
        {UI_THEME_OPTIONS.map((o) => (
          <option key={o.id} value={o.id} title={o.blurb}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
