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
  'https://mns-client.vercel.app',
  'https://bkbaji.com',
  'https://www.bkbaji.com',
  'https://admin.bkbaji.com',
  'https://aff.bkbaji.com',
  'https://bkb444.site',
  'https://www.bkb444.site',
  'https://admin.bkb444.site',
  ...corsFromEnv,
]);

/** Apex hosts whose every subdomain is allowed over HTTPS. */
const wildcardApexHosts = ['bkb444.site', 'bkbaji.com'];

function hostMatchesApex(hostname: string, apex: string): boolean {
  return hostname === apex || hostname.endsWith(`.${apex}`);
}

export function isAllowedCorsOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (explicitOrigins.has(origin)) return true;

  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:') return false;
    const hostname = url.hostname.toLowerCase();
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
  callback(new Error('Not allowed by CORS'));
}
