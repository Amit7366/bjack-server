import mongoose from 'mongoose';
import { BetTransaction } from '../Transaction/betTransaction.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { User } from '../User/user.model';

type CommonQuery = {
  page?: number;
  limit?: number;
  type?: 'win' | 'lose' | 'refund';
  status?: 'pending' | 'completed' | 'failed';
  provider?: string;
  game_type?: string;
  from?: string;
  to?: string;
  search?: string;
};

type UserQuery = CommonQuery & { userId: string };
type AdminQuery = CommonQuery & { userId?: string };

const buildFilter = (q: CommonQuery & { userId?: string }) => {
  const filter: any = {};

  if (q['userId']) {
    filter.userId = new mongoose.Types.ObjectId(String(q['userId']));
  }
  if (q.type) filter.type = q.type;
  if (q.status) filter.status = q.status;
  if (q.provider) filter['metadata.provider'] = q.provider;
  if (q.game_type) filter['metadata.game_type'] = q.game_type;

  if (q.from || q.to) {
    filter.createdAt = {};
    if (q.from) filter.createdAt.$gte = new Date(q.from);
    if (q.to) {
      const end = new Date(q.to);
      end.setUTCHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  if (q.search) {
    const rx = new RegExp(q.search, 'i');
    filter.$or = [
      { 'metadata.externalTxnId': rx },
      { 'metadata.serialNumber': rx },
      { 'metadata.roundId': rx },
      { id: rx },
    ];
  }

  return filter;
};

const totalsStage = () => ([
  {
    $group: {
      _id: null,
      totalWinAmount: {
        $sum: { $cond: [{ $eq: ['$type', 'win'] }, '$amount', 0] }
      },
      totalLoseAmount: {
        $sum: { $cond: [{ $eq: ['$type', 'lose'] }, { $ifNull: ['$metadata.betAmount', 0] }, 0] }
      },
      totalRefundAmount: {
        $sum: { $cond: [{ $eq: ['$type', 'refund'] }, '$amount', 0] }
      },
      winCount: { $sum: { $cond: [{ $eq: ['$type', 'win'] }, 1, 0] } },
      loseCount: { $sum: { $cond: [{ $eq: ['$type', 'lose'] }, 1, 0] } },
      refundCount: { $sum: { $cond: [{ $eq: ['$type', 'refund'] }, 1, 0] } },
    }
  },
  {
    $project: {
      _id: 0,
      totalWinAmount: 1,
      totalLoseAmount: 1,
      totalRefundAmount: 1,
      winCount: 1,
      loseCount: 1,
      refundCount: 1,
      netAmount: {
        $subtract: [
          { $add: ['$totalWinAmount', '$totalRefundAmount'] },
          '$totalLoseAmount'
        ]
      }
    }
  }
]);

/**
 * PROJECT helpers so we only return the fields you asked for.
 */
const userProject = {
  _id: 1,
  id: 1,
  userName: 1,
  contactNo: 1,
  role: 1,
  status: 1,
  lastActiveAt: 1,
  createdAt: 1,
};

const balanceProject = {
  _id: 1,
  userId: 1,
  id: 1,
  totalDeposit: 1,
  totalWithdraw: 1,
  currentBalance: 1,
  currentCoinBalance: 1,
  totalCoinDeposit: 1,
  totalCoinWithdraw: 1,
  lockedBalance: 1,
  createdAt: 1,
  updatedAt: 1,
};

export const getUserBetHistoryService = async (q: UserQuery) => {
  const { page = 1, limit = 20, userId } = q;
  const filter = buildFilter(q);

  const pipeline: any[] = [
    { $match: filter },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },

          // join User
          {
            $lookup: {
              from: 'users',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                { $project: userProject }
              ],
              as: 'user'
            }
          },
          // join UserBalance
          {
            $lookup: {
              from: 'userbalances',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
                { $project: balanceProject }
              ],
              as: 'balance'
            }
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] }, balance: { $arrayElemAt: ['$balance', 0] } } },
          {
            $project: {
              _id: 1,
              userId: 1,
              id: 1,
              amount: 1,
              type: 1,
              status: 1,
              cumulativeWin: 1,
              metadata: 1,
              createdAt: 1,
              updatedAt: 1,
              user: 1,
              balance: 1,
            }
          }
        ],
        summary: totalsStage(),
        meta: [{ $count: 'total' }],
        lastBet: [
          { $limit: 1 },
          {
            $lookup: {
              from: 'users',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                { $project: userProject }
              ],
              as: 'user'
            }
          },
          {
            $lookup: {
              from: 'userbalances',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
                { $project: balanceProject }
              ],
              as: 'balance'
            }
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] }, balance: { $arrayElemAt: ['$balance', 0] } } },
          {
            $project: {
              _id: 1, amount: 1, type: 1, status: 1, createdAt: 1,
              metadata: 1, id: 1, user: 1, balance: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        data: 1,
        summary: { $arrayElemAt: ['$summary', 0] },
        lastBet: { $arrayElemAt: ['$lastBet', 0] },
        total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
      }
    }
  ];

  const [agg] = await BetTransaction.aggregate(pipeline);

  // also include single user's profile/balance header for convenience
  const [user, userBalance] = await Promise.all([
    User.findById(userId).select(userProject as any).lean(),
    UserBalance.findOne({ userId }).select(balanceProject as any).lean(),
  ]);

  return {
    page,
    limit,
    total: agg?.total || 0,
    summary: agg?.summary || {
      totalWinAmount: 0,
      totalLoseAmount: 0,
      totalRefundAmount: 0,
      winCount: 0,
      loseCount: 0,
      refundCount: 0,
      netAmount: 0,
    },
    lastBet: agg?.lastBet || null,
    user: user || null,
    userBalance: userBalance || null,
    data: agg?.data || [],
  };
};

export const adminGetAllBetHistoryService = async (q: AdminQuery) => {
  const { page = 1, limit = 20, userId } = q;
  const filter = buildFilter(q);

  const pipeline: any[] = [
    { $match: filter },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        // 1) paginated txn list (with embedded user + balance)
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: 'users',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                { $project: userProject }
              ],
              as: 'user'
            }
          },
          {
            $lookup: {
              from: 'userbalances',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
                { $project: balanceProject }
              ],
              as: 'balance'
            }
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] }, balance: { $arrayElemAt: ['$balance', 0] } } },
          {
            $project: {
              _id: 1,
              userId: 1,
              id: 1,
              amount: 1,
              type: 1,
              status: 1,
              cumulativeWin: 1,
              metadata: 1,
              createdAt: 1,
              updatedAt: 1,
              user: 1,
              balance: 1,
            }
          }
        ],

        // 2) global totals across matched txns
        summary: totalsStage(),

        // 3) total count for pagination
        meta: [{ $count: 'total' }],

        // 4) last bet (overall)
        lastBet: [
          { $limit: 1 },
          {
            $lookup: {
              from: 'users',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                { $project: userProject }
              ],
              as: 'user'
            }
          },
          {
            $lookup: {
              from: 'userbalances',
              let: { uid: '$userId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
                { $project: balanceProject }
              ],
              as: 'balance'
            }
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] }, balance: { $arrayElemAt: ['$balance', 0] } } },
          {
            $project: {
              _id: 1, userId: 1, amount: 1, type: 1, status: 1, createdAt: 1,
              metadata: 1, id: 1, user: 1, balance: 1
            }
          }
        ],

        // 5) NEW: per-user rollups (same fields as user route)
        byUser: [
          {
            $group: {
              _id: '$userId',
              totalWinAmount: {
                $sum: { $cond: [{ $eq: ['$type', 'win'] }, '$amount', 0] }
              },
              totalLoseAmount: {
                $sum: { $cond: [{ $eq: ['$type', 'lose'] }, { $ifNull: ['$metadata.betAmount', 0] }, 0] }
              },
              totalRefundAmount: {
                $sum: { $cond: [{ $eq: ['$type', 'refund'] }, '$amount', 0] }
              },
              winCount: { $sum: { $cond: [{ $eq: ['$type', 'win'] }, 1, 0] } },
              loseCount: { $sum: { $cond: [{ $eq: ['$type', 'lose'] }, 1, 0] } },
              refundCount: { $sum: { $cond: [{ $eq: ['$type', 'refund'] }, 1, 0] } },
              lastBetAt: { $max: '$createdAt' },
            }
          },
          // join user to get memberId (sbmxxxxx) and name
          {
            $lookup: {
              from: 'users',
              let: { uid: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                { $project: { _id: 1, id: 1, userName: 1 } }
              ],
              as: 'user'
            }
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
          {
            $project: {
              _id: 1,
              memberId: '$user.id',       // e.g., sbm47373
              userName: '$user.userName',
              totalWinAmount: 1,
              totalLoseAmount: 1,
              totalRefundAmount: 1,
              winCount: 1,
              loseCount: 1,
              refundCount: 1,
              netAmount: {
                $subtract: [
                  { $add: ['$totalWinAmount', '$totalRefundAmount'] },
                  '$totalLoseAmount'
                ]
              },
              lastBetAt: 1,
            }
          },
          { $sort: { lastBetAt: -1 } } // newest active users first
        ],
      }
    },
    {
      $project: {
        data: 1,
        summary: { $arrayElemAt: ['$summary', 0] },
        lastBet: { $arrayElemAt: ['$lastBet', 0] },
        byUser: 1,
        total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
      }
    }
  ];

  const [result] = await BetTransaction.aggregate(pipeline);

  // Optional header when admin filters a single user
  let headerUser: any = undefined;
  let headerUserBalance: any = undefined;

  if (userId) {
    [headerUser, headerUserBalance] = await Promise.all([
      User.findById(userId).select(userProject as any).lean(),
      UserBalance.findOne({ userId }).select(balanceProject as any).lean(),
    ]);
  }

  return {
    page,
    limit,
    total: result?.total || 0,
    summary: result?.summary || {
      totalWinAmount: 0,
      totalLoseAmount: 0,
      totalRefundAmount: 0,
      winCount: 0,
      loseCount: 0,
      refundCount: 0,
      netAmount: 0,
    },
    lastBet: result?.lastBet || null,
    user: headerUser,              // only when ?userId=
    userBalance: headerUserBalance,// only when ?userId=
    byUser: result?.byUser || [],  // <-- per-user rollups
    data: result?.data || [],
  };
};

