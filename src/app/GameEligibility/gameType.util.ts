/** Promo / turnover buckets: slot, fishing, live, all (+ crash, sports for catalog). */
export function normalizeTurnoverGameType(raw: string): string {
  const s = String(raw ?? '').trim().toLowerCase();
  if (!s || s === 'all') return 'all';
  if (s === 'fish' || s === 'fishing' || s.includes('fish')) return 'fishing';
  if (s.includes('slot')) return 'slot';
  if (s.includes('live') || s.includes('casino') || s.includes('baccarat')) return 'live';
  if (s.includes('crash') || s.includes('aviator') || s.includes('spribe')) return 'crash';
  if (s.includes('sport') || s.includes('cricket')) return 'sports';
  return s;
}

export function allowsAllGameTypes(eligible: string[] | undefined | null): boolean {
  const normalized = (eligible ?? []).map(normalizeTurnoverGameType);
  if (!normalized.length) return true;
  return normalized.includes('all');
}

export function isGameTypeEligible(
  eligible: string[] | undefined | null,
  gameType: string | undefined
): boolean {
  const normalizedEligible = (eligible ?? []).map(normalizeTurnoverGameType);
  if (!normalizedEligible.length || normalizedEligible.includes('all')) return true;
  if (normalizedEligible.includes('none')) return false;
  if (!gameType) return false;

  const betType = normalizeTurnoverGameType(gameType);
  return normalizedEligible.some((e) => e === betType);
}

export function inferGameTypeFromTitle(title: string, vendorCode?: string): string {
  const u = String(title ?? '').toUpperCase();
  const vendor = String(vendorCode ?? '').toLowerCase();

  if (u.includes('AVIATOR') || vendor.includes('spribe')) return 'crash';
  if (vendor.includes('evolution') || vendor.includes('sexybcrt')) return 'live';
  if (vendor.includes('cricket') || vendor.includes('sports')) return 'sports';
  if (u.includes('FISH') || u.includes('FISHING')) return 'fishing';
  if (
    u.includes('BACCARAT') ||
    u.includes('ROULETTE') ||
    u.includes('BLACKJACK') ||
    u.includes('DRAGON TIGER') ||
    u.includes('SIC BO') ||
    u.includes('CRAZY TIME') ||
    u.includes('MONOPOLY') ||
    u.includes('MONEY WHEEL') ||
    u.includes('LIVE')
  ) {
    return 'live';
  }
  return 'slot';
}
