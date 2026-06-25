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
  if (s.includes('bingo') || s.includes('lottery')) return 'lottery';
  if (s.includes('arcade')) return 'arcade';
  if (s.includes('instant')) return 'instant';
  if (s.includes('poker')) return 'poker';
  if (s.includes('multiplayer')) return 'multiplayer';
  if (s.includes('lobby')) return 'lobby';
  if (s.includes('dice')) return 'dice';
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
    return 'table game';
  }
  if (s.includes('live') || s.includes('casino')) return 'casino';

  const u = String(title ?? '').toUpperCase();
  if (u.includes('FISH') || u.includes('FISHING')) return 'fishing';
  if (u.includes('LOTTERY') || u.includes('BINGO')) return 'lottery';
  if (u.includes('AVIATOR')) return 'crash';
  if (
    u.includes('BACCARAT') ||
    u.includes('ROULETTE') ||
    u.includes('BLACKJACK') ||
    u.includes('DRAGON TIGER') ||
    u.includes('SIC BO')
  ) {
    return 'table game';
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

/** Accepted MongoDB `types[]` values per lobby URL segment. */
export const LOBBY_KIND_TYPE_ALIASES: Record<string, readonly string[]> = {
  slot: ['slot', 'slot game', 'slots', 'instant', 'instant game', 'mini'],
  arcade: ['arcade', 'arcade game', 'multiplayer', 'multiplayer game'],
  table: ['table', 'table game', 'roulette', 'dice', 'poker', 'poker game'],
  fishing: ['fishing', 'fish', 'fish game'],
  lottery: ['lottery', 'lottery game', 'bingo', 'bingo game'],
  crash: ['crash', 'crash game'],
  sports: ['sports', 'sport', 'sportsbook'],
  casino: ['casino', 'live', 'live casino', 'live game', 'lobby'],
};

/** Lobby URL kind → MongoDB `types[]` values used for filtering. */
export function lobbyKindToCatalogTypes(kind: string): string[] {
  const k = String(kind ?? '').trim().toLowerCase();
  if (!k) return [];
  return [...(LOBBY_KIND_TYPE_ALIASES[k] ?? [k])];
}

/** Whether a single catalog `types[]` entry belongs to a lobby URL segment. */
export function catalogTypeMatchesLobbyKind(gameType: string, kind: string): boolean {
  const t = String(gameType ?? '').trim().toLowerCase();
  if (!t) return false;
  const k = String(kind ?? '').trim().toLowerCase();
  if (!k) return true;

  if (lobbyKindToCatalogTypes(k).includes(t)) return true;

  switch (k) {
    case 'fishing':
      return t.includes('fish');
    case 'slot':
      return t.includes('slot') || t.includes('instant') || t.includes('mini');
    case 'arcade':
      return t.includes('arcade') || t.includes('multiplayer');
    case 'table':
      return t.includes('table') || t.includes('roulette') || t.includes('dice') || t.includes('poker');
    case 'lottery':
      return t.includes('lottery') || t.includes('bingo');
    case 'crash':
      return t.includes('crash') || t.includes('aviator');
    case 'sports':
      return t.includes('sport') || t.includes('cricket');
    case 'casino':
      return t.includes('casino') || t.includes('live') || t.includes('lobby');
    default:
      return t === k || t.includes(k);
  }
}

export function gameTypesMatchLobbyKind(types: string[] | undefined, kind: string): boolean {
  if (!types?.length) return false;
  return types.some((t) => catalogTypeMatchesLobbyKind(t, kind));
}

/** Maps lobby catalog `types[]` value to turnover / rebate `game_type` bucket. */
export function lobbyCatalogTypeToTurnover(lobbyType: string): string {
  const s = String(lobbyType ?? '').trim().toLowerCase();
  if (s === 'casino' || s === 'table' || s.includes('table')) return 'live';
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
