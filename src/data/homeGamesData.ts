export type HomeGameSeed = {
  gameId: string;
  title: string;
  providerKey: string;
  providerLabel: string;
  gameCode?: string;
  gradient: string;
  glow: string;
  emoji?: string;
  image: string;
  sortOrder: number;
};

export const homeGames: HomeGameSeed[] = [
  {
    gameId: 'aviator',
    title: 'Aviator',
    providerLabel: 'SPRIBE',
    providerKey: 'spribe',
    gameCode: 'a04d1f3eb8ccec8a4823bdf18e3f0e84',
    gradient: 'from-[#c62828] via-[#8b1010] to-[#3d0808]',
    glow: '#ff5252',
    emoji: '✈️',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-aviator.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 0,
  },
  {
    gameId: 'superAcePlus',
    title: 'Super Ace Plus',
    providerLabel: 'LUCKY365',
    gameCode: '80aad2a10ae6a95068b50160d6c78897',
    providerKey: 'lucky365',
    gradient: 'from-[#f59e0b] via-[#d97706] to-[#92400e]',
    glow: '#fbbf24',
    emoji: '🃏',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-bj-super-ace-plus.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 1,
  },
  {
    gameId: 'treasuresAztec',
    title: 'Treasures of Aztec',
    providerLabel: 'PG SOFT',
    gameCode: '2fa9a84d096d6ff0bab53f81b79876c8',
    providerKey: 'pg',
    gradient: 'from-[#166534] via-[#14532d] to-[#052e16]',
    glow: '#4ade80',
    emoji: '🗿',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-treasures-of-aztec.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 2,
  },
  {
    gameId: 'fortuneGems',
    title: 'Fortune Gems 500',
    providerLabel: 'JILI',
    gameCode: '63927e939636f45e9d6d0b3717b3b1c1',
    providerKey: 'jili',
    gradient: 'from-[#ca8a04] via-[#a16207] to-[#713f12]',
    glow: '#fde047',
    emoji: '💎',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-fortune-gems-500.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 3,
  },
  {
    gameId: 'fortuneGaruda',
    title: 'Fortune Garuda 500',
    providerLabel: 'JILI',
    gameCode: 'aa609892f551de2053e92427dc4ae17f',
    providerKey: 'jili',
    gradient: 'from-[#b45309] via-[#92400e] to-[#451a03]',
    glow: '#fbbf24',
    emoji: '🦅',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-fortune-garuda-500.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 4,
  },
  {
    gameId: 'fortuneRabbit',
    title: 'Fortune Rabbit',
    providerLabel: 'PG SOFT',
    gameCode: 'e175cdd3215a02f5539cc8354a149b75',
    providerKey: 'pg',
    gradient: 'from-[#7c3aed] via-[#5b21b6] to-[#2e1065]',
    glow: '#c084fc',
    emoji: '🐰',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-fortune-rabbit.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 5,
  },
  {
    gameId: 'bjMoneyWheel',
    title: 'bj Money Wheel',
    providerLabel: 'JDB',
    gameCode: '6e19e03c50f035ddd9ffd804c30f8c80',
    providerKey: 'jdb',
    gradient: 'from-[#eab308] via-[#ca8a04] to-[#854d0e]',
    glow: '#fde047',
    emoji: '🎡',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-money-wheel.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 6,
  },
  {
    gameId: 'boxingKing',
    title: 'Boxing King',
    providerLabel: 'JILI',
    gameCode: '981f5f9675002fbeaaf24c4128b938d7',
    providerKey: 'jili',
    gradient: 'from-[#dc2626] via-[#b91c1c] to-[#7f1d1d]',
    glow: '#f87171',
    emoji: '🥊',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-boxing-king.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 7,
  },
];
