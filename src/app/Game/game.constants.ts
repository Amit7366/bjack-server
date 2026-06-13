/** Canonical game_type values — must match GameEligibility normalizeTurnoverGameType output. */
export const GAME_TYPES = ['slot', 'crash', 'live', 'sports', 'fishing'] as const;
export type GameType = (typeof GAME_TYPES)[number];

/** providerKey must match client i18n `home.providers` keys; label matches DB providerLabel casing. */
export const GAME_PROVIDERS: ReadonlyArray<{ key: string; label: string; group: string }> = [
  { key: 'jili', label: 'JILI', group: 'Slots' },
  { key: 'pg', label: 'PG SOFT', group: 'Slots' },
  { key: 'jdb', label: 'JDB', group: 'Slots' },
  { key: 'pragmatic', label: 'PRAGMATIC PLAY', group: 'Slots' },
  { key: 'hacksaw', label: 'HACKSAW', group: 'Slots' },
  { key: 'rich88', label: 'RICH88', group: 'Slots' },
  { key: 'fachai', label: 'FA CHAI', group: 'Slots' },
  { key: 'spadegaming', label: 'SPADEGAMING', group: 'Slots' },
  { key: 'cq9', label: 'CQ9', group: 'Slots' },
  { key: 'netent', label: 'NETENT', group: 'Slots' },
  { key: 'yellowBat', label: 'YELLOW BAT', group: 'Slots' },
  { key: 'lucky365', label: 'LUCKY365', group: 'Slots' },
  { key: 'spribe', label: 'SPRIBE', group: 'Crash' },
  { key: 'smartsoft', label: 'SMARTSOFT', group: 'Crash' },
  { key: 'turboGames', label: 'TURBO GAMES', group: 'Crash' },
  { key: 'bgaming', label: 'BGAMING', group: 'Crash' },
  { key: 'onlyplay', label: 'ONLYPLAY', group: 'Crash' },
  { key: 'inout', label: 'INOUT', group: 'Crash' },
  { key: 'galaxsys', label: 'GALAXSYS', group: 'Crash' },
  { key: 'mascot', label: 'MASCOT', group: 'Crash' },
  { key: 'aviator', label: 'AVIATOR', group: 'Crash' },
  { key: 'evolution', label: 'EVOLUTION', group: 'Casino' },
  { key: 'sexy', label: 'SEXY GAMING', group: 'Casino' },
  { key: 'sexybcrt', label: 'SEXY', group: 'Casino' },
  { key: 'ezugi', label: 'EZUGI', group: 'Casino' },
  { key: 'playtech', label: 'PLAYTECH', group: 'Casino' },
  { key: 'saGaming', label: 'SA GAMING', group: 'Casino' },
  { key: 'dreamGaming', label: 'DREAM GAMING', group: 'Casino' },
  { key: 'allbet', label: 'ALLBET', group: 'Casino' },
  { key: 'wmCasino', label: 'WM CASINO', group: 'Casino' },
  { key: 'vivoGaming', label: 'VIVO GAMING', group: 'Casino' },
  { key: 'cricket', label: 'CRICKET', group: 'Sports' },
  { key: 'btiSports', label: 'BTI SPORTS', group: 'Sports' },
  { key: 'inSports', label: 'INSPORTS', group: 'Sports' },
  { key: 'fbSports', label: 'FB SPORTS', group: 'Sports' },
  { key: 'ugSports', label: 'UG SPORTS', group: 'Sports' },
  { key: 'iSports', label: 'I-SPORTS', group: 'Sports' },
  { key: 'cmdSports', label: 'CMD SPORTS', group: 'Sports' },
  { key: 'sboSports', label: 'SBO SPORTS', group: 'Sports' },
  { key: 'eSports', label: 'E-SPORTS', group: 'Sports' },
  { key: 'horsebook', label: 'HORSEBOOK', group: 'Sports' },
  { key: 'pinnacle', label: 'PINNACLE', group: 'Sports' },
  { key: 'baccarat', label: 'BACCARAT', group: 'Table' },
  { key: 'roulette', label: 'ROULETTE', group: 'Table' },
  { key: 'blackjack', label: 'BLACKJACK', group: 'Table' },
  { key: 'sicbo', label: 'SIC BO', group: 'Table' },
  { key: 'dragonTiger', label: 'DRAGON TIGER', group: 'Table' },
  { key: 'teenPatti', label: 'TEEN PATTI', group: 'Table' },
  { key: 'kaGaming', label: 'KA GAMING', group: 'Fishing' },
  { key: 'bigGaming', label: 'BIG GAMING', group: 'Fishing' },
  { key: 'simplePlay', label: 'SIMPLE PLAY', group: 'Fishing' },
  { key: 'youlian', label: 'YOU LIAN', group: 'Fishing' },
];

export const PROVIDER_KEYS = GAME_PROVIDERS.map((p) => p.key);

/** Vendor lobby filter codes (awcv2_*). */
export const VENDOR_CODES: ReadonlyArray<{ code: string; label: string; providerKey: string }> = [
  { code: 'awcv2_jili', label: 'JILI', providerKey: 'jili' },
  { code: 'awcv2_pgsoft', label: 'PG Soft', providerKey: 'pg' },
  { code: 'awcv2_pragmaticplay', label: 'Pragmatic Play', providerKey: 'pragmatic' },
  { code: 'awcv2_jdb', label: 'JDB', providerKey: 'jdb' },
  { code: 'awcv2_fachai', label: 'Fa Chai', providerKey: 'fachai' },
  { code: 'awcv2_yellowbat', label: 'Yellow Bat', providerKey: 'yellowBat' },
  { code: 'awcv2_spribe', label: 'Spribe', providerKey: 'spribe' },
  { code: 'awcv2_smartsoft', label: 'SmartSoft', providerKey: 'smartsoft' },
  { code: 'awcv2_evolution', label: 'Evolution', providerKey: 'evolution' },
  { code: 'awcv2_sexybcrt', label: 'Sexy Gaming', providerKey: 'sexybcrt' },
  { code: 'awcv2_playtech', label: 'Playtech', providerKey: 'playtech' },
  { code: 'awcv2_dreamgaming', label: 'Dream Gaming', providerKey: 'dreamGaming' },
  { code: 'awcv2_wm', label: 'WM Casino', providerKey: 'wmCasino' },
  { code: 'awcv2_biggaming', label: 'Big Gaming', providerKey: 'bigGaming' },
  { code: 'awcv2_cricket', label: 'Cricket', providerKey: 'cricket' },
  { code: 'awcv2_bti', label: 'BTi Sports', providerKey: 'btiSports' },
  { code: 'awcv2_insports', label: 'IN Sports', providerKey: 'inSports' },
  { code: 'awcv2_fbsports', label: 'FB Sports', providerKey: 'fbSports' },
  { code: 'awcv2_baccarat', label: 'Baccarat', providerKey: 'baccarat' },
  { code: 'awcv2_roulette', label: 'Roulette', providerKey: 'roulette' },
];

export const VENDOR_CODE_VALUES = VENDOR_CODES.map((v) => v.code);

export function providerByKey(key: string) {
  return GAME_PROVIDERS.find((p) => p.key === key);
}

export function vendorByCode(code: string) {
  return VENDOR_CODES.find((v) => v.code === code);
}
