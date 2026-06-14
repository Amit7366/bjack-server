import { Types } from 'mongoose';
import { GameTxnRecord } from '../models/GameTxnRecord';

export type GameTxnHistoryRow = {
  txnId: string;
  gameRound?: string | null;
  bet: number;
  win: number;
  currencyCode: string;
  providerTsUtc: Date;
  gameUid?: string;
  game?: {
    name?: string;
    code?: string;
    provider?: string;
    type?: string;
  };
};

export type UserGameBetsResult = {
  sbmId: string;
  total: number;
  totalBets: number;
  totalWins: number;
  page: number;
  limit: number;
  totalPages: number;
  history: GameTxnHistoryRow[];
};

type GetUserBetsQuery = {
  sbmId: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export class GameTxnRecordsService {
  private buildMatch(
    sbmId: string,
    from?: string,
    to?: string
  ): Record<string, unknown> {
    const match: Record<string, unknown> = { sbmId: sbmId.trim().toLowerCase() };

    if (from || to) {
      match.providerTsUtc = {};
      if (from) {
        (match.providerTsUtc as Record<string, Date>).$gte = new Date(from);
      }
      if (to) {
        const end = new Date(to);
        end.setUTCHours(23, 59, 59, 999);
        (match.providerTsUtc as Record<string, Date>).$lte = end;
      }
    }

    return match;
  }

  private async aggregateHistory(
    match: Record<string, unknown>,
    skip: number,
    limit: number
  ) {
    const [facet] = await GameTxnRecord.aggregate([
      { $match: match },
      {
        $facet: {
          meta: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                totalBets: { $sum: '$bet' },
                totalWins: { $sum: '$win' },
              },
            },
          ],
          history: [
            { $sort: { providerTsUtc: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'gamecatalogs',
                let: { uid: '$gameUid' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ['$gameCode', '$$uid'] },
                          { $eq: ['$tileId', '$$uid'] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: 'gameInfo',
              },
            },
            {
              $unwind: {
                path: '$gameInfo',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                txnId: 1,
                gameRound: 1,
                bet: 1,
                win: 1,
                currencyCode: 1,
                providerTsUtc: 1,
                gameUid: 1,
                game: {
                  name: {
                    $ifNull: ['$gameInfo.game_name', '$gameInfo.title'],
                  },
                  code: {
                    $ifNull: ['$gameInfo.gameCode', '$gameUid'],
                  },
                  provider: {
                    $ifNull: ['$gameInfo.provider', '$gameInfo.providerLabel'],
                  },
                  type: '$gameInfo.game_type',
                },
              },
            },
          ],
        },
      },
    ]);

    return facet;
  }

  async getUserBets(q: GetUserBetsQuery): Promise<UserGameBetsResult> {
    const { sbmId, userId, from, to, page = 1, limit = 20 } = q;
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;
    const normalizedSbmId = sbmId.trim().toLowerCase();

    let match = this.buildMatch(normalizedSbmId, from, to);
    let facet = await this.aggregateHistory(match, skip, safeLimit);
    let meta = facet?.meta?.[0];

    if ((meta?.total ?? 0) === 0 && userId && Types.ObjectId.isValid(userId)) {
      match = this.buildMatch(normalizedSbmId, from, to);
      delete match.sbmId;
      match.userId = new Types.ObjectId(userId);
      facet = await this.aggregateHistory(match, skip, safeLimit);
      meta = facet?.meta?.[0];
    }

    const total = meta?.total ?? 0;

    return {
      sbmId: normalizedSbmId,
      total,
      totalBets: meta?.totalBets ?? 0,
      totalWins: meta?.totalWins ?? 0,
      page: safePage,
      limit: safeLimit,
      totalPages: total > 0 ? Math.ceil(total / safeLimit) : 0,
      history: facet?.history ?? [],
    };
  }
}
