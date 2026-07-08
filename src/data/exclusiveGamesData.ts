import { allProviderGames } from './gameData';
import { normalizeTurnoverGameType } from '../app/GameEligibility/gameType.util';

export type ExclusiveGameSeed = {
  image: string;
  gameId?: string;
  gameCode?: string;
  title?: string;
  game_type?: string;
  sortOrder: number;
};

type CatalogGame = {
  game_name: string;
  game_code: string;
  game_type: string;
  game_image: string;
};

/** Home i18n keys + aggregator game codes (aligned with popular strip). */
const EXCLUSIVE_CAROUSEL_REFS: Array<{
  gameId: string;
  gameCode: string;
  game_type?: string;
}> = [
  { gameId: 'aviator', gameCode: 'a04d1f3eb8ccec8a4823bdf18e3f0e84', game_type: 'crash' },
  { gameId: 'superAcePlus', gameCode: '80aad2a10ae6a95068b50160d6c78897' },
  { gameId: 'treasuresAztec', gameCode: '2fa9a84d096d6ff0bab53f81b79876c8' },
  { gameId: 'anubisWrath', gameCode: 'c268154a85669eea35aa46387834ac76' },
  { gameId: 'wildBountyShowdown', gameCode: 'c98bb64436826fe9a2c62955ff70cba9' },
  { gameId: 'superAce', gameCode: 'bdfb23c974a2517198c5443adeea77a8' },
  { gameId: 'bjMoneyWheel', gameCode: '6e19e03c50f035ddd9ffd804c30f8c80', game_type: 'live' },
  { gameId: 'boxingKing', gameCode: '981f5f9675002fbeaaf24c4128b938d7' },
];

function buildGameCodeIndex(): Map<string, CatalogGame> {
  const index = new Map<string, CatalogGame>();
  for (const { games } of allProviderGames) {
    for (const game of games) {
      index.set(game.game_code, game);
    }
  }
  return index;
}

const gameByCode = buildGameCodeIndex();

function resolveExclusiveSlide(
  ref: { gameId: string; gameCode: string; game_type?: string },
  sortOrder: number,
): ExclusiveGameSeed {
  const catalog = gameByCode.get(ref.gameCode);
  if (!catalog) {
    throw new Error(`Exclusive carousel game not found in gameData: ${ref.gameCode}`);
  }

  return {
    image: catalog.game_image?.trim() ?? '',
    gameId: ref.gameId,
    gameCode: ref.gameCode,
    title: catalog.game_name,
    game_type: ref.game_type ?? normalizeTurnoverGameType(catalog.game_type),
    sortOrder,
  };
}

const baseExclusiveSlides = EXCLUSIVE_CAROUSEL_REFS.map((ref, index) =>
  resolveExclusiveSlide(ref, index),
);

/** Carousel banner URLs from gameData (one per popular exclusive game). */
export const exclusiveCarouselBannerImages = baseExclusiveSlides.map((slide) => slide.image);

/** Two carousel loops so the home banner scroll feels continuous. */
export const exclusiveGames: ExclusiveGameSeed[] = [
  ...baseExclusiveSlides,
  ...baseExclusiveSlides.map((slide, offset) => ({
    ...slide,
    sortOrder: baseExclusiveSlides.length + offset,
  })),
];
