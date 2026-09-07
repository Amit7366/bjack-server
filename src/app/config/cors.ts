const corsFromEnv = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const explicitOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5000',
  'http://localhost:5173',
  'https://banglajackpot.online',
  'https://www.banglajackpot.online',
  'https://admin.banglajackpot.online',
  'https://aff.banglajackpot.online',
  ...corsFromEnv,
]);

/** Apex hosts whose every subdomain is allowed over HTTPS (https://*.banglajackpot.online). */
const wildcardApexHosts = ['banglajackpot.online'];

function hostMatchesApex(hostname: string, apex: string): boolean {
  return hostname === apex || hostname.endsWith(`.${apex}`);
}

export function isAllowedCorsOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (explicitOrigins.has(origin)) return true;

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return wildcardApexHosts.some((apex) => hostMatchesApex(hostname, apex));
  } catch {
    return false;
  }
}

export function corsOriginDelegate(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void {
  if (isAllowedCorsOrigin(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`Not allowed by CORS (${origin ?? 'unknown origin'})`));
}
