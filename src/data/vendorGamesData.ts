import { allProviderGames } from './gameData';
import { normalizeTurnoverGameType } from '../app/GameEligibility/gameType.util';

export type VendorGameSeed = {
  tileId: string;
  title: string;
  providerKey: string;
  providerLabel: string;
  gameCode: string;
  gradient: string;
  glow: string;
  emoji?: string;
  image: string;
  types: string[];
  vendorCode: string;
  sortOrder: number;
};

type ProviderVendorMeta = {
  vendorCode: string;
  providerKey: string;
  providerLabel: string;
  gradient: string;
  glow: string;
};

/** Maps gameData.ts `provider` slug → vendor lobby metadata. */
const PROVIDER_VENDOR_META: Record<string, ProviderVendorMeta> = {
  pgsoft: {
    vendorCode: 'awcv2_pgsoft',
    providerKey: 'pg',
    providerLabel: 'PG SOFT',
    gradient: 'from-[#14532d] via-[#166534] to-[#052e16]',
    glow: '#4ade80',
  },
  jilli: {
    vendorCode: 'awcv2_jili',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gradient: 'from-[#7c2d12] via-[#ea580c] to-[#431407]',
    glow: '#fb923c',
  },
  jili: {
    vendorCode: 'awcv2_jili',
    providerKey: 'jili',
    providerLabel: 'JILI',
    gradient: 'from-[#7c2d12] via-[#ea580c] to-[#431407]',
    glow: '#fb923c',
  },
  spribe: {
    vendorCode: 'awcv2_spribe',
    providerKey: 'spribe',
    providerLabel: 'SPRIBE',
    gradient: 'from-[#7f1d1d] via-[#dc2626] to-[#450a0a]',
    glow: '#fca5a5',
  },
  evolution: {
    vendorCode: 'awcv2_evolution',
    providerKey: 'evolution',
    providerLabel: 'EVOLUTION',
    gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#172554]',
    glow: '#93c5fd',
  },
  pragmatic: {
    vendorCode: 'awcv2_pragmaticplay',
    providerKey: 'pragmatic',
    providerLabel: 'PRAGMATIC PLAY',
    gradient: 'from-[#4c1d95] via-[#7c3aed] to-[#2e1065]',
    glow: '#a78bfa',
  },
  fachai: {
    vendorCode: 'awcv2_fachai',
    providerKey: 'fachai',
    providerLabel: 'FA CHAI',
    gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#172554]',
    glow: '#60a5fa',
  },
  jdb: {
    vendorCode: 'awcv2_jdb',
    providerKey: 'jdb',
    providerLabel: 'JDB',
    gradient: 'from-[#713f12] via-[#ca8a04] to-[#422006]',
    glow: '#fbbf24',
  },
  yellowbat: {
    vendorCode: 'awcv2_yellowbat',
    providerKey: 'yellowBat',
    providerLabel: 'YELLOW BAT',
    gradient: 'from-[#86198f] via-[#c026d3] to-[#4a044e]',
    glow: '#e879f9',
  },
  sexybcrt: {
    vendorCode: 'awcv2_sexybcrt',
    providerKey: 'sexybcrt',
    providerLabel: 'SEXY',
    gradient: 'from-[#831843] via-[#db2777] to-[#500724]',
    glow: '#f472b6',
  },
  playtech: {
    vendorCode: 'awcv2_playtech',
    providerKey: 'playtech',
    providerLabel: 'PLAYTECH',
    gradient: 'from-[#0c4a6e] via-[#0369a1] to-[#082f49]',
    glow: '#38bdf8',
  },
  playngo: {
    vendorCode: 'awcv2_playngo',
    providerKey: 'playngo',
    providerLabel: "PLAY'n GO",
    gradient: 'from-[#365314] via-[#65a30d] to-[#1a2e05]',
    glow: '#bef264',
  },
  eazygaming: {
    vendorCode: 'awcv2_eazygaming',
    providerKey: 'eazygaming',
    providerLabel: 'EAZY GAMING',
    gradient: 'from-[#134e4a] via-[#0d9488] to-[#042f2e]',
    glow: '#5eead4',
  },
  bggaming: {
    vendorCode: 'awcv2_biggaming',
    providerKey: 'bigGaming',
    providerLabel: 'BIG GAMING',
    gradient: 'from-[#7c2d12] via-[#c2410c] to-[#431407]',
    glow: '#fb923c',
  },
  km: {
    vendorCode: 'awcv2_km',
    providerKey: 'km',
    providerLabel: 'KING MIDAS',
    gradient: 'from-[#854d0e] via-[#ca8a04] to-[#422006]',
    glow: '#fcd34d',
  },
  relaxgaming: {
    vendorCode: 'awcv2_relaxgaming',
    providerKey: 'relaxgaming',
    providerLabel: 'RELAX GAMING',
    gradient: 'from-[#312e81] via-[#4338ca] to-[#1e1b4b]',
    glow: '#a5b4fc',
  },
  evoplay: {
    vendorCode: 'awcv2_evoplay',
    providerKey: 'evoplay',
    providerLabel: 'EVOPLAY',
    gradient: 'from-[#581c87] via-[#7e22ce] to-[#3b0764]',
    glow: '#d8b4fe',
  },
  ezugi: {
    vendorCode: 'awcv2_ezugi',
    providerKey: 'ezugi',
    providerLabel: 'EZUGI',
    gradient: 'from-[#14532d] via-[#16a34a] to-[#052e16]',
    glow: '#4ade80',
  },
  ideal: {
    vendorCode: 'awcv2_ideal',
    providerKey: 'ideal',
    providerLabel: 'IDEAL',
    gradient: 'from-[#1e293b] via-[#334155] to-[#0f172a]',
    glow: '#94a3b8',
  },
  cq9: {
    vendorCode: 'awcv2_cq9',
    providerKey: 'cq9',
    providerLabel: 'CQ9',
    gradient: 'from-[#0e7490] via-[#0891b2] to-[#164e63]',
    glow: '#67e8f9',
  },
  cricket: {
    vendorCode: 'awcv2_cricket',
    providerKey: 'cricket',
    providerLabel: 'CRICKET',
    gradient: 'from-[#166534] via-[#15803d] to-[#052e16]',
    glow: '#86efac',
  },
};

const DEFAULT_VENDOR_META: ProviderVendorMeta = {
  vendorCode: 'awcv2_unknown',
  providerKey: 'unknown',
  providerLabel: 'UNKNOWN',
  gradient: 'from-[#374151] via-[#1f2937] to-[#111827]',
  glow: '#6b7280',
};

function resolveProviderMeta(provider: string): ProviderVendorMeta {
  const key = provider.trim().toLowerCase();
  if (PROVIDER_VENDOR_META[key]) {
    return PROVIDER_VENDOR_META[key];
  }

  const vendorCode = key.startsWith('awcv2_') ? key : `awcv2_${key}`;
  return {
    vendorCode,
    providerKey: key.replace(/[^a-z0-9]/g, ''),
    providerLabel: provider.trim().toUpperCase(),
    gradient: DEFAULT_VENDOR_META.gradient,
    glow: DEFAULT_VENDOR_META.glow,
  };
}

function catalogGameType(rawType: string): string {
  return normalizeTurnoverGameType(rawType);
}

function buildVendorGameSeed(
  provider: string,
  game: {
    game_name: string;
    game_code: string;
    game_type: string;
    game_image: string;
  },
  sortOrder: number,
): VendorGameSeed {
  const meta = resolveProviderMeta(provider);
  const gameType = catalogGameType(game.game_type);
  const image = game.game_image?.trim() ?? '';
  const hasImage = Boolean(image);

  return {
    tileId: `${meta.vendorCode}-${game.game_code}`,
    title: game.game_name.trim(),
    providerKey: meta.providerKey,
    providerLabel: meta.providerLabel,
    gameCode: game.game_code,
    gradient: hasImage ? meta.gradient : '',
    glow: hasImage ? meta.glow : '',
    image,
    types: [gameType],
    vendorCode: meta.vendorCode,
    sortOrder,
  };
}

/** All vendor catalog games sourced from gameData.ts — no manual duplicates. */
export const vendorGames: VendorGameSeed[] = allProviderGames.flatMap(({ provider, games }) =>
  games.map((game, index) => buildVendorGameSeed(provider, game, index)),
);

export const GAMES_BY_VENDOR: Record<string, VendorGameSeed[]> = vendorGames.reduce<
  Record<string, VendorGameSeed[]>
>((acc, game) => {
  if (!acc[game.vendorCode]) acc[game.vendorCode] = [];
  acc[game.vendorCode].push(game);
  return acc;
}, {});

export const vendorGameStats = {
  totalGames: vendorGames.length,
  byProvider: allProviderGames.map(({ provider, games }) => ({
    provider,
    count: games.length,
    vendorCode: resolveProviderMeta(provider).vendorCode,
  })),
};
