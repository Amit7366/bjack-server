import { ExclusiveGameModel } from '../../models/ExclusiveGameModel';

export const getExclusiveGames = async () => {
  const slides = await ExclusiveGameModel.find().sort({ sortOrder: 1 }).lean();
  return slides.map((s) => ({
    image: s.image,
    gameId: s.gameId,
    gameCode: s.gameCode,
    title: s.title,
  }));
};
