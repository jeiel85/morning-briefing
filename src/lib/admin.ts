/**
 * Global config (e.g. source enable/disable) is operator-only. Admins are an
 * allowlist of visitor IDs in the ADMIN_VISITOR_IDS env var (comma-separated).
 * Unset → nobody is an admin, so global config is effectively read-only. This
 * fails closed: an anonymous visitor can never mutate shared state by default.
 */
export function isAdmin(user: { id: string } | null | undefined): boolean {
  if (!user) return false;
  const ids = (process.env.ADMIN_VISITOR_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(user.id);
}
