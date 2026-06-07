import { Types } from 'mongoose';
import { GameCatalogModel } from '../../../models/GameCatalogModel';
import { TurnoverTracking } from '../../UserPromotion/turnoverTracking.model';
import { SignupBonusTracking } from '../../User/signupBonusTracking.model';
import { ReferralBonusTracking } from '../../ReferralRewardTracker/referralBonusTracking.model';
import { LoginBonusTracking } from '../../User/loginBonusTracking.model';

type InsertedBetDoc = {
  userId?: Types.ObjectId | string;
  gameUid?: string;
  bet?: number;
};

/** Map catalog / promo labels to a shared turnover bucket. */
export function normalizeTurnoverGameType(raw: string): string {
  const s = String(raw ?? '').trim().toLowerCase();
  if (!s || s === 'all') return 'all';
  if (s === 'fish' || s === 'fishing' || s.includes('fish')) return 'fishing';
  if (s.includes('slot')) return 'slot';
  if (s.includes('live')) return 'live';
  return s;
}

function isBetEligible(eligible: string[], catalogType: string | undefined): boolean {
  const normalizedEligible = (eligible ?? []).map(normalizeTurnoverGameType);
  if (normalizedEligible.includes('all')) return true;
  if (normalizedEligible.includes('none')) return false;
  if (!catalogType) return false;

  const betType = normalizeTurnoverGameType(catalogType);
  return normalizedEligible.some((e) => e === betType);
}

async function resolveCatalogTypes(gameCodes: string[]): Promise<Map<string, string>> {
  if (!gameCodes.length) return new Map();

  const rows = await GameCatalogModel.find(
    { gameCode: { $in: gameCodes } },
    { gameCode: 1, game_type: 1 }
  ).lean();

  return new Map(rows.map((g) => [String(g.gameCode), String(g.game_type)]));
}

async function findDepositTracker(userId: Types.ObjectId) {
  const active = await TurnoverTracking.findOne({
    userId,
    isCompleted: false,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (active) return active;

  return TurnoverTracking.findOne({
    userId,
    isCompleted: false,
    turnoverRequired: { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .lean();
}

function sumEligibleBet(
  docs: InsertedBetDoc[],
  userId: string,
  eligible: string[],
  catalogByCode: Map<string, string>
): number {
  const normalizedEligible = (eligible ?? []).map(normalizeTurnoverGameType);
  let total = 0;

  for (const d of docs) {
    if (String(d.userId) !== userId) continue;
    const bet = Number(d.bet ?? 0);
    if (!Number.isFinite(bet) || bet <= 0) continue;

    if (normalizedEligible.includes('all')) {
      total += bet;
      continue;
    }

    const catalogType = catalogByCode.get(String(d.gameUid ?? ''));
    if (isBetEligible(eligible, catalogType)) {
      total += bet;
    }
  }

  return total;
}

/**
 * Increment turnoverCompleted on pending trackers after new game_txn_records insert.
 */
export async function applyTurnoverForInsertedBets(
  insertedDocs: InsertedBetDoc[]
): Promise<void> {
  if (!insertedDocs.length) return;

  const userIdsSet = new Set<string>();
  const gameCodesSet = new Set<string>();

  for (const d of insertedDocs) {
    if (d.userId) userIdsSet.add(String(d.userId));
    if (d.gameUid) gameCodesSet.add(String(d.gameUid));
  }

  const userIds = [...userIdsSet];
  if (!userIds.length) return;

  const catalogByCode = await resolveCatalogTypes([...gameCodesSet]);
  const userObjectIds = userIds.map((id) => new Types.ObjectId(id));

  const totalBetByUser = new Map<string, number>();
  for (const d of insertedDocs) {
    const userIdStr = String(d.userId ?? '');
    const bet = Number(d.bet ?? 0);
    if (!userIdStr || !Number.isFinite(bet) || bet <= 0) continue;
    totalBetByUser.set(userIdStr, (totalBetByUser.get(userIdStr) || 0) + bet);
  }

  const depositBulkOps: Parameters<typeof TurnoverTracking.bulkWrite>[0] = [];

  for (const userIdStr of userIds) {
    const tracker = await findDepositTracker(new Types.ObjectId(userIdStr));
    if (!tracker) continue;

    const eligible = Array.isArray(tracker.eligibleGameTypes)
      ? tracker.eligibleGameTypes
      : ['all'];
    const increment = sumEligibleBet(insertedDocs, userIdStr, eligible, catalogByCode);
    if (increment <= 0) continue;

    const newCompleted = Number(tracker.turnoverCompleted ?? 0) + increment;
    const required = Number(tracker.turnoverRequired ?? 0);
    const willComplete = required > 0 && newCompleted >= required;

    depositBulkOps.push({
      updateOne: {
        filter: { _id: tracker._id },
        update: {
          $inc: { turnoverCompleted: increment },
          ...(willComplete
            ? {
                $set: {
                  isCompleted: true,
                  isActive: false,
                  eligibleGameTypes: ['none'],
                  maxWithdraw: null,
                },
              }
            : {}),
        },
      },
    });
  }

  if (depositBulkOps.length) {
    await TurnoverTracking.bulkWrite(depositBulkOps, { ordered: false }).catch(() => undefined);
  }

  const [signup, referral, login] = await Promise.all([
    SignupBonusTracking.find({ userId: { $in: userObjectIds }, isCompleted: false }).lean(),
    ReferralBonusTracking.find({
      referredUserId: { $in: userObjectIds },
      isCompleted: false,
    }).lean(),
    LoginBonusTracking.find({ userId: { $in: userObjectIds }, isCompleted: false }).lean(),
  ]);

  const signupBulkOps: Parameters<typeof SignupBonusTracking.bulkWrite>[0] = [];
  for (const s of signup) {
    const u = String(s.userId);
    const increment = totalBetByUser.get(u) || 0;
    if (increment <= 0) continue;

    const newCompleted = Number(s.turnoverCompleted ?? 0) + increment;
    const required = Number(s.turnoverRequired ?? 0);
    const willComplete = required > 0 && newCompleted >= required;

    signupBulkOps.push({
      updateOne: {
        filter: { _id: s._id, isCompleted: false },
        update: {
          $inc: { turnoverCompleted: increment },
          ...(willComplete ? { $set: { isCompleted: true } } : {}),
        },
      },
    });
  }

  const referralBulkOps: Parameters<typeof ReferralBonusTracking.bulkWrite>[0] = [];
  for (const r of referral) {
    const referredUserIdStr = String(r.referredUserId);
    const increment = totalBetByUser.get(referredUserIdStr) || 0;
    if (increment <= 0) continue;

    const newCompleted = Number(r.turnoverCompleted ?? 0) + increment;
    const required = Number(r.turnoverRequired ?? 0);
    const willComplete = required > 0 && newCompleted >= required;

    referralBulkOps.push({
      updateOne: {
        filter: { _id: r._id, isCompleted: false },
        update: {
          $inc: { turnoverCompleted: increment },
          ...(willComplete ? { $set: { isCompleted: true } } : {}),
        },
      },
    });
  }

  const loginBulkOps: Parameters<typeof LoginBonusTracking.bulkWrite>[0] = [];
  for (const l of login) {
    const u = String(l.userId);
    const increment = totalBetByUser.get(u) || 0;
    if (increment <= 0) continue;

    const newCompleted = Number(l.turnoverCompleted ?? 0) + increment;
    const required = Number(l.turnoverRequired ?? 0);
    const willComplete = required > 0 && newCompleted >= required;

    loginBulkOps.push({
      updateOne: {
        filter: { _id: l._id, isCompleted: false },
        update: {
          $inc: { turnoverCompleted: increment },
          ...(willComplete ? { $set: { isCompleted: true } } : {}),
        },
      },
    });
  }

  await Promise.all([
    signupBulkOps.length
      ? SignupBonusTracking.bulkWrite(signupBulkOps, { ordered: false }).catch(() => undefined)
      : Promise.resolve(),
    referralBulkOps.length
      ? ReferralBonusTracking.bulkWrite(referralBulkOps, { ordered: false }).catch(() => undefined)
      : Promise.resolve(),
    loginBulkOps.length
      ? LoginBonusTracking.bulkWrite(loginBulkOps, { ordered: false }).catch(() => undefined)
      : Promise.resolve(),
  ]);
}
