export type ExclusiveGameSeed = {
  image: string;
  gameId?: string;
  gameCode?: string;
  title?: string;
  game_type?: string;
  sortOrder: number;
};

const exclusiveCarouselBannerImages = [
  'https://img.b112j.com/upload/h5Announcement/image_303040.png',
  'https://img.b112j.com/upload/h5Announcement/image_303092.png',
  'https://img.b112j.com/upload/h5Announcement/image_302600.png',
  'https://img.b112j.com/upload/h5Announcement/image_303094.png',
  'https://img.b112j.com/upload/h5Announcement/image_303096.png',
  'https://img.b112j.com/upload/h5Announcement/image_303098.png',
  'https://img.b112j.com/upload/h5Announcement/image_303100.png',
  'https://img.b112j.com/upload/h5Announcement/image_303040.png',
  'https://img.b112j.com/upload/h5Announcement/image_303092.png',
  'https://img.b112j.com/upload/h5Announcement/image_302600.png',
  'https://img.b112j.com/upload/h5Announcement/image_303094.png',
  'https://img.b112j.com/upload/h5Announcement/image_303096.png',
  'https://img.b112j.com/upload/h5Announcement/image_303098.png',
  'https://img.b112j.com/upload/h5Announcement/image_303100.png',
];

/** i18n keys + game codes aligned with home popular strip order. */
const popularGameRefs: Array<{
  gameId: string;
  gameCode: string;
  game_type: string;
}> = [
  { gameId: 'aviator', gameCode: 'a04d1f3eb8ccec8a4823bdf18e3f0e84', game_type: 'crash' },
  { gameId: 'superAcePlus', gameCode: '80aad2a10ae6a95068b50160d6c78897', game_type: 'slot' },
  { gameId: 'treasuresAztec', gameCode: '2fa9a84d096d6ff0bab53f81b79876c8', game_type: 'slot' },
  { gameId: 'fortuneGems', gameCode: '63927e939636f45e9d6d0b3717b3b1c1', game_type: 'slot' },
  { gameId: 'fortuneGaruda', gameCode: 'aa609892f551de2053e92427dc4ae17f', game_type: 'slot' },
  { gameId: 'fortuneRabbit', gameCode: 'e175cdd3215a02f5539cc8354a149b75', game_type: 'slot' },
  { gameId: 'bjMoneyWheel', gameCode: '6e19e03c50f035ddd9ffd804c30f8c80', game_type: 'live' },
  { gameId: 'boxingKing', gameCode: '981f5f9675002fbeaaf24c4128b938d7', game_type: 'slot' },
];

export const exclusiveGames: ExclusiveGameSeed[] = exclusiveCarouselBannerImages.map(
  (image, index) => {
    const ref = popularGameRefs[index % popularGameRefs.length];
    return {
      image,
      gameId: ref.gameId,
      gameCode: ref.gameCode,
      game_type: ref.game_type,
      sortOrder: index,
    };
  },
);
