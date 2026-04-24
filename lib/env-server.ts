/**
 * Trim + strip accidental surrounding quotes (common when copy-pasting into Vercel or .env).
 */
export function cleanEnvVar(value: string | undefined): string {
  if (value == null) return "";
  let t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"') && t.length > 1) ||
    (t.startsWith("'") && t.endsWith("'") && t.length > 1)
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function isTruthyEnv(value: string | undefined): boolean {
  return cleanEnvVar(value).length > 0;
}
