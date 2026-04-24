export const UI_THEME_IDS = [
  "neon",
  "linux",
  "vscode",
  "windows",
  "bmw",
  "omega",
  "rolex",
  "casio",
] as const;

export type UiThemeId = (typeof UI_THEME_IDS)[number];

export const DEFAULT_UI_THEME: UiThemeId = "neon";

const SET = new Set<string>(UI_THEME_IDS);

export function isUiThemeId(s: string | null | undefined): s is UiThemeId {
  return s != null && SET.has(s);
}

export function parseUiThemeId(s: unknown, fallback: UiThemeId = DEFAULT_UI_THEME): UiThemeId {
  if (typeof s === "string" && isUiThemeId(s)) return s;
  return fallback;
}

export const UI_THEME_OPTIONS: {
  id: UiThemeId;
  label: string;
  blurb: string;
}[] = [
  { id: "neon", label: "Neon lab", blurb: "Default synth / cyan + magenta" },
  { id: "linux", label: "Linux (GNOME dark)", blurb: "Adwaita-like purple, orange, deep gray" },
  { id: "vscode", label: "VS Code Dark+", blurb: "Editor dark, blue + violet accents" },
  { id: "windows", label: "Windows 11", blurb: "Fluent dark, system blue" },
  { id: "bmw", label: "BMW (inspired)", blurb: "Black, silver, motorsport blue" },
  { id: "omega", label: "Omega (inspired)", blurb: "Racing red, black, tool-watch feel" },
  { id: "rolex", label: "Rolex (inspired)", blurb: "Green, gold, classic dial tones" },
  { id: "casio", label: "Casio (inspired)", blurb: "G-Shock / digital: resin black, orange, acid yellow" },
];

const LS_KEY = "watch-drift-ui-theme";

export function readGuestThemeFromStorage(): UiThemeId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (isUiThemeId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeGuestThemeToStorage(theme: UiThemeId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, theme);
  } catch {
    /* ignore */
  }
}
