import { Types } from 'mongoose';
import { GameCatalogModel } from '../../models/GameCatalogModel';
import { HomeGameModel } from '../../models/HomeGameModel';
import { ExclusiveGameModel } from '../../models/ExclusiveGameModel';
import { TurnoverTracking } from '../UserPromotion/turnoverTracking.model';
import {
  allowsAllGameTypes,
  inferGameTypeFromTitle,
  isGameTypeEligible,
  normalizeTurnoverGameType,
} from './gameType.util';
import { accountStatusEligibilityReason, getUserAccountStatus } from '../User/userAccountStatus.util';

export type GameEligibilityResult = {
  allowed: boolean;
  gameCode: string;
  gameType: string | null;
  eligibleGameTypes: string[];
  promoCode: string | null;
  restricted: boolean;
  reason?: string;
};

async function findActiveEligibleGameTypes(userId: string): Promise<{
  eligibleGameTypes: string[];
  promoCode: string | null;
}> {
  const userObjectId = new Types.ObjectId(userId);

  const active = await TurnoverTracking.findOne({
    userId: userObjectId,
    isCompleted: false,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  const tracker =
    active ??
    (await TurnoverTracking.findOne({
      userId: userObjectId,
      isCompleted: false,
      turnoverRequired: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .lean());

  if (!tracker) {
    return { eligibleGameTypes: ['all'], promoCode: null };
  }

  const eligible = Array.isArray(tracker.eligibleGameTypes)
    ? tracker.eligibleGameTypes.map(String)
    : ['all'];

  return {
    eligibleGameTypes: eligible,
    promoCode: tracker.promoCode ? String(tracker.promoCode) : null,
  };
}

export async function resolveGameTypeByCode(gameCode: string): Promise<string | null> {
  const code = String(gameCode ?? '').trim();
  if (!code) return null;

  const catalog = await GameCatalogModel.findOne({
    $or: [{ gameCode: code }, { tileId: code }],
  })
    .select('game_type types title vendorCode providerKey game_name')
    .lean();

  if (catalog) {
    if (catalog.game_type) {
      return normalizeTurnoverGameType(String(catalog.game_type));
    }
    const fromTypes = catalog.types?.[0];
    if (fromTypes) return normalizeTurnoverGameType(String(fromTypes));
    return inferGameTypeFromTitle(
      String(catalog.title ?? catalog.game_name ?? ''),
      String(catalog.vendorCode ?? catalog.providerKey ?? '')
    );
  }

  const home = await HomeGameModel.findOne({
    $or: [{ gameCode: code }, { gameId: code }],
  })
    .select('game_type title providerKey')
    .lean();

  if (home) {
    if (home.game_type) return normalizeTurnoverGameType(String(home.game_type));
    return inferGameTypeFromTitle(String(home.title ?? ''), String(home.providerKey ?? ''));
  }

  const exclusive = await ExclusiveGameModel.findOne({
    $or: [{ gameCode: code }, { gameId: code }],
  })
    .select('game_type title gameId')
    .lean();

  if (exclusive) {
    if (exclusive.game_type) return normalizeTurnoverGameType(String(exclusive.game_type));
    return inferGameTypeFromTitle(String(exclusive.title ?? exclusive.gameId ?? ''), '');
  }

  return null;
}

export async function checkGameLaunchEligibility(
  userId: string,
  gameCode: string
): Promise<GameEligibilityResult> {
  const code = String(gameCode ?? '').trim();
  if (!code) {
    return {
      allowed: false,
      gameCode: code,
      gameType: null,
      eligibleGameTypes: ['all'],
      promoCode: null,
      restricted: false,
      reason: 'Game code is required',
    };
  }

  const accountStatus = await getUserAccountStatus(userId);
  const statusReason = accountStatusEligibilityReason(accountStatus);
  if (statusReason) {
    return {
      allowed: false,
      gameCode: code,
      gameType: null,
      eligibleGameTypes: ['all'],
      promoCode: null,
      restricted: false,
      reason: statusReason,
    };
  }

  const [{ eligibleGameTypes, promoCode }, gameType] = await Promise.all([
    findActiveEligibleGameTypes(userId),
    resolveGameTypeByCode(code),
  ]);

  const restricted = !allowsAllGameTypes(eligibleGameTypes);

  if (!restricted) {
    return {
      allowed: true,
      gameCode: code,
      gameType,
      eligibleGameTypes,
      promoCode,
      restricted: false,
    };
  }

  if (!gameType) {
    return {
      allowed: false,
      gameCode: code,
      gameType: null,
      eligibleGameTypes,
      promoCode,
      restricted: true,
      reason: 'This game is not available under your current deposit promotion',
    };
  }

  const allowed = isGameTypeEligible(eligibleGameTypes, gameType);

  return {
    allowed,
    gameCode: code,
    gameType,
    eligibleGameTypes,
    promoCode,
    restricted: true,
    reason: allowed
      ? undefined
      : 'This game is not included in your deposit promotion. Please play eligible games only.',
  };
}

export async function getActiveGameRestrictions(userId: string) {
  const { eligibleGameTypes, promoCode } = await findActiveEligibleGameTypes(userId);
  return {
    eligibleGameTypes,
    promoCode,
    restricted: !allowsAllGameTypes(eligibleGameTypes),
  };
}
