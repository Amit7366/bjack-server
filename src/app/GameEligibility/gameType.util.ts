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

/** Maps raw catalog `game_type` to lobby URL kind values stored in GameCatalog `types[]`. */
export function normalizeLobbyCatalogType(raw: string, title?: string): string {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'fish' || s === 'fishing' || s.includes('fish')) return 'fishing';
  if (s.includes('slot')) return 'slot';
  if (s.includes('lottery')) return 'lottery';
  if (s.includes('arcade')) return 'arcade';
  if (s.includes('crash') || s.includes('aviator')) return 'crash';
  if (s.includes('sport') || s.includes('cricket')) return 'sports';
  if (
    s.includes('baccarat') ||
    s.includes('roulette') ||
    s.includes('blackjack') ||
    s.includes('sicbo') ||
    s.includes('sic bo') ||
    s.includes('dragon tiger') ||
    s.includes('teen patti') ||
    s.includes('poker') ||
    s.includes('table')
  ) {
    return 'table';
  }
  if (s.includes('live') || s.includes('casino')) return 'casino';

  const u = String(title ?? '').toUpperCase();
  if (u.includes('FISH') || u.includes('FISHING')) return 'fishing';
  if (u.includes('LOTTERY')) return 'lottery';
  if (u.includes('AVIATOR')) return 'crash';
  if (
    u.includes('BACCARAT') ||
    u.includes('ROULETTE') ||
    u.includes('BLACKJACK') ||
    u.includes('DRAGON TIGER') ||
    u.includes('SIC BO')
  ) {
    return 'table';
  }
  if (
    u.includes('CRAZY TIME') ||
    u.includes('MONOPOLY') ||
    u.includes('MONEY WHEEL') ||
    u.includes('LIVE')
  ) {
    return 'casino';
  }
  return 'slot';
}

/** Maps lobby catalog `types[]` value to turnover / rebate `game_type` bucket. */
export function lobbyCatalogTypeToTurnover(lobbyType: string): string {
  const s = String(lobbyType ?? '').trim().toLowerCase();
  if (s === 'casino' || s === 'table') return 'live';
  if (s === 'slot' || s === 'crash' || s === 'sports' || s === 'fishing') return s;
  return 'slot';
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

export type RebateCategory = 'slot' | 'live' | 'sports' | 'poker' | 'fishing';

export const REBATE_CATEGORIES: RebateCategory[] = [
  'slot',
  'live',
  'sports',
  'poker',
  'fishing',
];

/** Maps game catalog / bet metadata into rebate UI buckets. */
export function normalizeRebateCategory(
  raw: string | undefined,
  title?: string,
  vendorCode?: string
): RebateCategory {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s.includes('poker')) return 'poker';
  if (s === 'fish' || s === 'fishing' || s.includes('fish')) return 'fishing';
  if (s.includes('sport') || s.includes('cricket')) return 'sports';
  if (s.includes('live') || s.includes('casino') || s.includes('baccarat')) return 'live';
  if (s.includes('slot')) return 'slot';

  const inferred = inferGameTypeFromTitle(title ?? '', vendorCode);
  if (inferred === 'fishing') return 'fishing';
  if (inferred === 'sports') return 'sports';
  if (inferred === 'live') return 'live';
  return 'slot';
}
