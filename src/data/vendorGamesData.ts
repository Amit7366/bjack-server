export type VendorGameSeed = {
  tileId: string;
  title: string;
  providerKey: string;
  providerLabel: string;
  gameCode?: string;
  gradient: string;
  glow: string;
  emoji?: string;
  image: string;
  types?: string[];
  vendorCode: string;
  sortOrder: number;
};

const JILI_SLOT_GAMES: Omit<VendorGameSeed, 'vendorCode' | 'sortOrder'>[] = [
  {
    tileId: '1',
    title: 'SUPER ACE',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gameCode: 'bdfb23c974a2517198c5443adeea77a8',
    gradient: 'from-[#7c2d12] via-[#ea580c] to-[#431407]',
    glow: '#fb923c',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-027.png?v=1778346484115',
  },
  {
    tileId: '2',
    title: 'WILD BOUNTY SHOWDOWN',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: 'c98bb64436826fe9a2c62955ff70cba9',
    gradient: 'from-[#14532d] via-[#166534] to-[#052e16]',
    glow: '#4ade80',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-138.png?v=1772695650667',
  },
  {
    tileId: '3',
    title: 'FORTUNE GEMS 500',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gameCode: 'a990de177577a2e6a889aaac5f57b429',
    gradient: 'from-[#a16207] via-[#eab308] to-[#713f12]',
    glow: '#fde047',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-193.png?v=1778230919660',
  },
  {
    tileId: '4',
    title: 'SUPER ELEMENTS',
    providerKey: 'fachai',
    providerLabel: 'FA CHAI',
    gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#172554]',
    glow: '#60a5fa',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-031.png?v=1778346484761',
  },
  {
    tileId: '5',
    title: "DIVA'S ACE",
    providerKey: 'yellowbat',
    providerLabel: 'YELLOW BAT',
    gradient: 'from-[#86198f] via-[#c026d3] to-[#4a044e]',
    glow: '#e879f9',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-029.png?v=1778346484445',
  },
  {
    tileId: '6',
    title: 'GOLDEN GENIE',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gradient: 'from-[#854d0e] via-[#ca8a04] to-[#422006]',
    glow: '#fcd34d',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-119.png?v=1770106828547',
  },
  {
    tileId: '7',
    title: 'MONEY COMING',
    providerKey: 'jili',
    providerLabel: 'JDB',
    gameCode: 'db249defce63610fccabfa829a405232',
    gradient: 'from-[#713f12] via-[#ca8a04] to-[#422006]',
    glow: '#fbbf24',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-136.png?v=1772695063881',
  },
  {
    tileId: '8',
    title: 'BOXING KING',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gameCode: '981f5f9675002fbeaaf24c4128b938d7',
    gradient: 'from-[#7f1d1d] via-[#dc2626] to-[#450a0a]',
    glow: '#f87171',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-027.png?v=1778346484115',
  },
  {
    tileId: '9',
    title: 'FORTUNE RABBIT',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: 'e175cdd3215a02f5539cc8354a149b75',
    gradient: 'from-[#5b21b6] via-[#7c3aed] to-[#2e1065]',
    glow: '#c084fc',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-014.png?v=1778346481994',
  },
  {
    tileId: '10',
    title: 'TREASURES OF AZTEC',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: '2fa9a84d096d6ff0bab53f81b79876c8',
    gradient: 'from-[#14532d] via-[#15803d] to-[#052e16]',
    glow: '#4ade80',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-129.png?v=1774269694257',
  },
  {
    tileId: '11',
    title: 'LUCKY NEKO',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: 'e1b4c6b95746d519228744771f15fe4b',
    gradient: 'from-[#9d174d] via-[#db2777] to-[#500724]',
    glow: '#fb7185',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-112.png?v=1778346495876',
  },
  {
    tileId: '12',
    title: 'CANDY BONANZA',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: 'bbe2320adc5c506e7e56a2d24d96a252',
    gradient: 'from-[#be185d] via-[#ec4899] to-[#831843]',
    glow: '#f9a8d4',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-115.png?v=1778346496388',
  },
  {
    tileId: '13',
    title: 'MAHJONG WAYS 2',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gameCode: 'ba2adf72179e1ead9e3dae8f0a7d4c07',
    gradient: 'from-[#365314] via-[#65a30d] to-[#1a2e05]',
    glow: '#bef264',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-105.png?v=1778346494557',
  },
  {
    tileId: '14',
    title: 'GATES OF OLYMPUS',
    providerKey: 'pragmatic',
    providerLabel: 'PRAGMATIC PLAY',
    gradient: 'from-[#4c1d95] via-[#7c3aed] to-[#2e1065]',
    glow: '#a78bfa',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-028.png?v=1778346484292',
  },
  {
    tileId: '15',
    title: 'SWEET BONANZA',
    providerKey: 'pragmatic',
    providerLabel: 'PRAGMATIC PLAY',
    gradient: 'from-[#be123c] via-[#f43f5e] to-[#881337]',
    glow: '#fda4af',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-026.png?v=1778346483894',
  },
  {
    tileId: '16',
    title: 'BIG BASS BONANZA',
    providerKey: 'pragmatic',
    providerLabel: 'PRAGMATIC PLAY',
    gradient: 'from-[#0c4a6e] via-[#0369a1] to-[#082f49]',
    glow: '#38bdf8',
    image: 'https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-041.png?v=1778346485693',
  },
];

function providerKeyFromVendorDisplayLabel(label: string): string {
  const k = label.trim().toUpperCase();
  const map: Record<string, string> = {
    EXCLUSIVE: 'exclusive',
    'PG SOFT': 'pgsoft',
    'PRAGMATIC PLAY': 'pragmaticplay',
    JDB: 'jdb',
    'FA CHAI': 'fachai',
    'YELLOW BAT': 'yellowbat',
  };
  return map[k] ?? k.replace(/\s+/g, '').toLowerCase();
}

function withProviderLabel(
  games: Omit<VendorGameSeed, 'vendorCode' | 'sortOrder'>[],
  label: string,
  vendorCode: string,
): VendorGameSeed[] {
  const providerKey = providerKeyFromVendorDisplayLabel(label);
  return games.map((g, i) => ({
    ...g,
    tileId: `${vendorCode}-${label}-${i}`,
    providerLabel: label,
    providerKey,
    vendorCode,
    sortOrder: i,
  }));
}

const SEXY_CASINO_GAMES: VendorGameSeed[] = [
  {
    tileId: 'awcv2_sexybcrt-s1',
    title: 'SEXY BACCARAT',
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    gradient: 'from-[#831843] via-[#db2777] to-[#500724]',
    glow: '#f472b6',
    image: 'https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-172.png?v=1778347211427',
    vendorCode: 'awcv2_sexybcrt',
    sortOrder: 0,
  },
  {
    tileId: 'awcv2_sexybcrt-s2',
    title: 'SEXY DRAGON TIGER',
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    gradient: 'from-[#7f1d1d] via-[#dc2626] to-[#450a0a]',
    glow: '#f87171',
    image: 'https://img.b112j.com/upload/game/AWCV2_SEXYBCRT/BDT/MX-LIVE-001_SEXY_1.png?v=1776572481238',
    vendorCode: 'awcv2_sexybcrt',
    sortOrder: 1,
  },
  {
    tileId: 'awcv2_sexybcrt-s3',
    title: 'SEXY ROULETTE',
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    gradient: 'from-[#14532d] via-[#16a34a] to-[#052e16]',
    glow: '#4ade80',
    image: 'https://img.b112j.com/upload/game/AWCV2_PP/BDT/PP-LIVE-197.png?v=1775816233629',
    vendorCode: 'awcv2_sexybcrt',
    sortOrder: 2,
  },
  {
    tileId: 'awcv2_sexybcrt-s4',
    title: 'SEXY SIC BO',
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    gradient: 'from-[#713f12] via-[#ca8a04] to-[#422006]',
    glow: '#fcd34d',
    image: 'https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-183.png?v=1778347212769',
    vendorCode: 'awcv2_sexybcrt',
    sortOrder: 3,
  },
  ...JILI_SLOT_GAMES.slice(0, 12).map((g, i) => ({
    ...g,
    tileId: `awcv2_sexybcrt-sx${i}`,
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    vendorCode: 'awcv2_sexybcrt',
    sortOrder: i + 4,
  })),
];

const EVOLUTION_GAMES: VendorGameSeed[] = [
  {
    tileId: 'awcv2_evolution-e1',
    title: 'LIGHTNING ROULETTE',
    providerKey: 'evolution',
    providerLabel: 'EVOLUTION',
    gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#172554]',
    glow: '#93c5fd',
    image: 'https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-180.png?v=1778347212264',
    vendorCode: 'awcv2_evolution',
    sortOrder: 0,
  },
  {
    tileId: 'awcv2_evolution-e2',
    title: 'CRAZY TIME',
    providerKey: 'evolution',
    providerLabel: 'EVOLUTION',
    gradient: 'from-[#7c2d12] via-[#ea580c] to-[#431407]',
    glow: '#fdba74',
    image: 'https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-212.png?v=1778347214583',
    vendorCode: 'awcv2_evolution',
    sortOrder: 1,
  },
  {
    tileId: 'awcv2_evolution-e3',
    title: 'MONOPOLY LIVE',
    providerKey: 'evolution',
    providerLabel: 'EVOLUTION',
    gradient: 'from-[#14532d] via-[#22c55e] to-[#052e16]',
    glow: '#86efac',
    image: 'https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-037.png?v=1778347198916',
    vendorCode: 'awcv2_evolution',
    sortOrder: 2,
  },
  ...JILI_SLOT_GAMES.slice(0, 13).map((g, i) => ({
    ...g,
    tileId: `awcv2_evolution-ev${i}`,
    providerKey: 'evolution',
    providerLabel: 'EVOLUTION',
    vendorCode: 'awcv2_evolution',
    sortOrder: i + 3,
  })),
];

const SPRIBE_CRASH: VendorGameSeed[] = [
  {
    tileId: 'awcv2_spribe-av',
    title: 'AVIATOR',
    providerKey: 'spribe',
    providerLabel: 'SPRIBE',
    gameCode: 'a04d1f3eb8ccec8a4823bdf18e3f0e84',
    gradient: 'from-[#7f1d1d] via-[#dc2626] to-[#450a0a]',
    glow: '#fca5a5',
    image: 'https://img.b112j.com/upload/game/AWCV2_SPRIBE/BDT/SPRIBE-EGAME-001.png?v=1775037934474',
    vendorCode: 'awcv2_spribe',
    sortOrder: 0,
  },
  ...JILI_SLOT_GAMES.slice(0, 15).map((g, i) => ({
    ...g,
    tileId: `awcv2_spribe-sp${i}`,
    providerKey: 'spribe',
    providerLabel: 'SPRIBE',
    vendorCode: 'awcv2_spribe',
    sortOrder: i + 1,
  })),
];

const SPORTS_PLACEHOLDER: VendorGameSeed[] = JILI_SLOT_GAMES.map((g, i) => ({
  ...g,
  tileId: `awcv2_cricket-spo${i}`,
  title: `${g.title} LIVE`,
  providerKey: 'cricket',
  providerLabel: 'SPORTS',
  vendorCode: 'awcv2_cricket',
  sortOrder: i,
}));

const GAMES_BY_VENDOR: Record<string, VendorGameSeed[]> = {
  awcv2_exclusive: withProviderLabel(JILI_SLOT_GAMES.slice(0, 14), 'EXCLUSIVE', 'awcv2_exclusive'),
  awcv2_jili: JILI_SLOT_GAMES.map((g, i) => ({
    ...g,
    vendorCode: 'awcv2_jili',
    sortOrder: i,
  })),
  awcv2_pgsoft: withProviderLabel(JILI_SLOT_GAMES, 'PG SOFT', 'awcv2_pgsoft'),
  awcv2_pragmaticplay: withProviderLabel(JILI_SLOT_GAMES, 'PRAGMATIC PLAY', 'awcv2_pragmaticplay'),
  awcv2_jdb: withProviderLabel(JILI_SLOT_GAMES, 'JDB', 'awcv2_jdb'),
  awcv2_fachai: withProviderLabel(JILI_SLOT_GAMES, 'FA CHAI', 'awcv2_fachai'),
  awcv2_yellowbat: withProviderLabel(JILI_SLOT_GAMES, 'YELLOW BAT', 'awcv2_yellowbat'),
  awcv2_sexybcrt: SEXY_CASINO_GAMES,
  awcv2_evolution: EVOLUTION_GAMES,
  awcv2_spribe: SPRIBE_CRASH,
  awcv2_cricket: SPORTS_PLACEHOLDER,
};

export const vendorGames: VendorGameSeed[] = Object.values(GAMES_BY_VENDOR).flat();

export { GAMES_BY_VENDOR };
