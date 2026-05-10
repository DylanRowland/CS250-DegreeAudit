// Helper methods to get the last audit session and store in local storage
function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw == null || raw.trim() === '') {
    return '';
  }
  return raw.replace(/\/$/, '');
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  return base ? `${base}${normalized}` : normalized;
}

export const AUDIT_SESSION_KEY = 'lastAudit';
