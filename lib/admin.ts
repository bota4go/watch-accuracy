/** Single-app admin: allowed email (overridable via env). */
const DEFAULT_ADMIN_EMAIL = "bota4go@gmail.com";

export function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === adminEmail();
}
