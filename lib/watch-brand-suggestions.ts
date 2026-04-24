/**
 * Hints for the "New watch" field — not exhaustive; any custom name still works.
 */

const EXTRA: readonly string[] = [
  "A. Lange & Söhne",
  "Audemars Piguet",
  "Ball Watch",
  "Baume & Mercier",
  "Bell & Ross",
  "Blancpain",
  "Breguet",
  "Breitling",
  "Bulova",
  "Cartier",
  "Chopard",
  "Christopher Ward",
  "Doxa",
  "Ebel",
  "Eterna",
  "Fortis",
  "Frederique Constant",
  "Garmin",
  "Girard-Perregaux",
  "Hublot",
  "IWC",
  "Jaeger-LeCoultre",
  "Mido",
  "Montblanc",
  "Movado",
  "Nivada",
  "Nomos",
  "Oris",
  "Panerai",
  "Patek Philippe",
  "Piaget",
  "Rado",
  "Raketa",
  "Sinn",
  "Squale",
  "Stowa",
  "Swatch",
  "TAG Heuer",
  "Timex",
  "Tudor",
  "Ulysse Nardin",
  "Vacheron Constantin",
  "Vostok",
  "Yema",
  "Zodiac",
  "Zenith",
];

/** Short list for the quick-pick chip row. */
export const WATCH_BRAND_QUICK_PICKS: readonly string[] = [
  "Seiko",
  "Rolex",
  "Omega",
  "Casio",
  "G-Shock",
  "Citizen",
  "Grand Seiko",
  "Tudor",
  "Tissot",
  "Hamilton",
  "Longines",
  "Apple Watch",
];

const merged = Array.from(new Set([...WATCH_BRAND_QUICK_PICKS, ...EXTRA]));
merged.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

export const WATCH_BRAND_SUGGESTIONS: readonly string[] = merged;

export function matchWatchBrands(query: string, max = 8): string[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const starts: string[] = [];
  const includes: string[] = [];
  for (const b of WATCH_BRAND_SUGGESTIONS) {
    const bl = b.toLowerCase();
    if (bl.startsWith(q)) starts.push(b);
    else if (bl.includes(q)) includes.push(b);
  }
  return [...starts, ...includes].slice(0, max);
}
