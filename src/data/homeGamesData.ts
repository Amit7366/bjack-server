export type HomeGameSeed = {
  gameId: string;
  title: string;
  providerKey: string;
  providerLabel: string;
  gameCode?: string;
  game_type: string;
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
    game_type: 'crash',
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
    game_type: 'slot',
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
    game_type: 'slot',
    providerKey: 'pg',
    gradient: 'from-[#166534] via-[#14532d] to-[#052e16]',
    glow: '#4ade80',
    emoji: '🗿',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-treasures-of-aztec.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 2,
  },
  {
    gameId: 'anubisWrath',
    title: 'Anubis Wrath',
    providerLabel: 'PG SOFT',
    gameCode: 'c268154a85669eea35aa46387834ac76',
    game_type: 'slot',
    providerKey: 'pg',
    gradient: 'from-[#166534] via-[#14532d] to-[#052e16]',
    glow: '#4ade80',
    emoji: '🗿',
    image:
      'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Anubis-Wrath.png',
    sortOrder: 3,
  },
  {
    gameId: 'wildBountyShowdown',
    title: 'Wild Bounty Showdown',
    providerLabel: 'PG SOFT',
    gameCode: 'c98bb64436826fe9a2c62955ff70cba9',
    game_type: 'slot',
    providerKey: 'pg',
    gradient: 'from-[#166534] via-[#14532d] to-[#052e16]',
    glow: '#4ade80',
    emoji: '🗿',
    image:
      'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Bounty-Showdown_1024_rounded.png',
    sortOrder: 4,
  },
  {
    gameId: 'superAce',
    title: 'Super Ace',
    providerLabel: 'JILI',
    gameCode: 'bdfb23c974a2517198c5443adeea77a8',
    game_type: 'slot',
    providerKey: 'jili',
    gradient: 'from-[#166534] via-[#14532d] to-[#052e16]',
    glow: '#4ade80',
    emoji: '🗿',
    image:
      'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Super-Ace.png',
    sortOrder: 5,
  },
  {
    gameId: 'bjMoneyWheel',
    title: 'bj Money Wheel',
    providerLabel: 'JILI',
    gameCode: '6e19e03c50f035ddd9ffd804c30f8c80',
    game_type: 'live',
    providerKey: 'jili',
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
    game_type: 'slot',
    providerKey: 'jili',
    gradient: 'from-[#dc2626] via-[#b91c1c] to-[#7f1d1d]',
    glow: '#f87171',
    emoji: '🥊',
    image:
      'https://img.b112j.com/bj/h5/assets/images/exclusivegames/default/exclusive-boxing-king.png?v=1778752753270&source=drccdnsrc',
    sortOrder: 7,
  },
  {
    gameId: 'chickenRoad2',
    title: 'Chicken Road 2.0',
    providerLabel: 'INOUT',
    gameCode: '562b299961b0ec40f252a832453c67b0',
    game_type: 'slot',
    providerKey: 'inout',
    gradient: 'from-[#f97316] via-[#ea580c] to-[#9a3412]',
    glow: '#fb923c',
    emoji: '🐔',
    image: 'https://i.ibb.co.com/hFckdPtt/IO-002-Chicken-Road-2-0.png',
    sortOrder: 8,
  },
];
