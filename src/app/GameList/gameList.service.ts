// gameList.service.ts
import { GameCatalogModel } from '../../models/GameCatalogModel';

interface GameFilter {
  provider?: string;
  game_type?: string;
  vendor?: string | string[];
}

function isValidGameImageUrl(src: string): boolean {
  if (!src.trim()) return false;
  try {
    const url = new URL(src.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Prefer `game_image`, then `image`; empty when neither is a usable URL. */
function resolveCatalogImage(doc: Record<string, unknown>): string {
  const candidates = [doc.game_image, doc.image];
  for (const candidate of candidates) {
    const value = String(candidate ?? '').trim();
    if (isValidGameImageUrl(value)) return value;
  }
  return '';
}

function toGameTile(doc: Record<string, unknown>) {
  return {
    id: String(doc.tileId ?? doc._id),
    title: String(doc.title ?? doc.game_name ?? ''),
    providerKey: String(doc.providerKey ?? doc.provider ?? ''),
    providerLabel: String(doc.providerLabel ?? doc.provider ?? ''),
    gameCode: doc.gameCode ? String(doc.gameCode) : undefined,
    gradient: String(doc.gradient ?? ''),
    glow: String(doc.glow ?? ''),
    emoji: doc.emoji ? String(doc.emoji) : undefined,
    image: resolveCatalogImage(doc),
    types: Array.isArray(doc.types) ? doc.types.map(String) : undefined,
  };
}

export const createGame = async (data: Record<string, unknown>) => {
  return await GameCatalogModel.create(data);
};

export const getAllCatalogGamesForAdmin = async () => {
  return GameCatalogModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
};

export const getGameById = async (id: string) => {
  return await GameCatalogModel.findById(id);
};

export const updateGame = async (id: string, data: Record<string, unknown>) => {
  return await GameCatalogModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGame = async (id: string) => {
  return await GameCatalogModel.findByIdAndDelete(id);
};

export const getFilteredGames = async (filter: GameFilter) => {
  const query: Record<string, unknown> = {};

  if (filter.provider) {
    query.$or = [{ provider: filter.provider }, { providerKey: filter.provider }];
  }
  if (filter.game_type) {
    query.game_type = filter.game_type;
  }

  const games = await GameCatalogModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
  const total = await GameCatalogModel.countDocuments(query);

  return {
    meta: { total },
    data: games,
  };
};

export const getVendorGames = async (vendorCodes: string[]) => {
  const query =
    vendorCodes.length > 0
      ? { vendorCode: { $in: vendorCodes } }
      : { vendorCode: { $exists: true, $ne: null } };

  const games = await GameCatalogModel.find(query).sort({ vendorCode: 1, sortOrder: 1 }).lean();
  const seen = new Set<string>();
  const data = [];

  for (const doc of games) {
    const tile = toGameTile(doc as Record<string, unknown>);
    const dedupeKey = tile.gameCode?.trim() || tile.id;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    data.push(tile);
  }

  return {
    meta: { total: data.length },
    data,
  };
};

export const groupByProvider = async () => {
  return await GameCatalogModel.aggregate([
    {
      $group: {
        _id: '$provider',
        categories: { $addToSet: '$game_type' },
        gamesByCategory: {
          $push: {
            game_type: '$game_type',
            gameCode: '$gameCode',
            game_name: '$game_name',
            game_image: '$game_image',
            platform: '$platform',
          },
        },
      },
    },
    {
      $project: {
        provider: '$_id',
        categories: 1,
        games: {
          $arrayToObject: {
            $map: {
              input: '$categories',
              as: 'cat',
              in: {
                k: '$$cat',
                v: {
                  $filter: {
                    input: '$gamesByCategory',
                    as: 'g',
                    cond: { $eq: ['$$g.game_type', '$$cat'] },
                  },
                },
              },
            },
          },
        },
        _id: 0,
      },
    },
  ]);
};

export const groupByCategory = async () => {
  return await GameCatalogModel.aggregate([
    {
      $group: {
        _id: '$game_type',
        providers: { $addToSet: '$provider' },
        gamesByProvider: {
          $push: {
            provider: '$provider',
            gameCode: '$gameCode',
            game_name: '$game_name',
            game_image: '$game_image',
            platform: '$platform',
          },
        },
      },
    },
    {
      $project: {
        category: '$_id',
        providers: 1,
        games: {
          $arrayToObject: {
            $map: {
              input: '$providers',
              as: 'prov',
              in: {
                k: '$$prov',
                v: {
                  $filter: {
                    input: '$gamesByProvider',
                    as: 'g',
                    cond: { $eq: ['$$g.provider', '$$prov'] },
                  },
                },
              },
            },
          },
        },
        _id: 0,
      },
    },
  ]);
};
