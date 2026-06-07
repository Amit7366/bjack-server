import { HomeGameModel } from '../../models/HomeGameModel';

export const getHomeGames = async () => {
  const games = await HomeGameModel.find().sort({ sortOrder: 1 }).lean();
  return games.map((g) => ({
    id: g.gameId,
    title: g.title,
    providerKey: g.providerKey,
    providerLabel: g.providerLabel,
    gameCode: g.gameCode,
    gradient: g.gradient,
    glow: g.glow,
    emoji: g.emoji,
    image: g.image,
  }));
};
