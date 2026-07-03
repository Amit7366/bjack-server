import { Types } from 'mongoose';
import { Mission } from './mission.model';
import { MissionProgress } from './missionProgress.model';

export type MissionTab = 'running' | 'coming-soon' | 'closed';

export type MissionListItem = {
  id: string;
  slug: string;
  title: string;
  rules: string;
  dateRange: string;
  startsAt: string;
  endsAt: string;
  remainingSeconds: number | null;
  currentValue: number;
  targetValue: number;
  percent: number;
  medalType: 'bronze' | 'silver';
};

type SupportedLocale = 'en' | 'bn' | 'hi';

function resolveLocale(value?: string): SupportedLocale {
  if (value === 'bn' || value === 'hi') return value;
  return 'en';
}

function formatMissionDate(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function formatDateRange(startsAt: Date, endsAt: Date): string {
  return `${formatMissionDate(startsAt)} ~ ${formatMissionDate(endsAt)}`;
}

function computePercent(currentValue: number, targetValue: number): number {
  if (targetValue <= 0) return 0;
  return Math.min(100, Math.floor((currentValue / targetValue) * 100));
}

function resolveMissionTab(startsAt: Date, endsAt: Date, now: Date): MissionTab {
  if (now < startsAt) return 'coming-soon';
  if (now > endsAt) return 'closed';
  return 'running';
}

function remainingSecondsForMission(endsAt: Date, now: Date, tab: MissionTab): number | null {
  if (tab !== 'running') return null;
  const diffMs = endsAt.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
}

export async function listMissionsForUser(
  userId: string,
  tab: MissionTab,
  localeInput?: string
): Promise<MissionListItem[]> {
  const locale = resolveLocale(localeInput);
  const now = new Date();
  const userObjectId = new Types.ObjectId(userId);

  const missions = await Mission.find({ isActive: true }).sort({ sortOrder: 1, startsAt: 1 }).lean();

  const filtered = missions.filter((mission) => {
    const startsAt = new Date(mission.startsAt);
    const endsAt = new Date(mission.endsAt);
    return resolveMissionTab(startsAt, endsAt, now) === tab;
  });

  if (!filtered.length) return [];

  const slugs = filtered.map((mission) => mission.slug);
  const progressRows = await MissionProgress.find({
    userId: userObjectId,
    missionSlug: { $in: slugs },
  }).lean();

  const progressBySlug = new Map(progressRows.map((row) => [row.missionSlug, row.currentValue]));

  return filtered.map((mission) => {
    const startsAt = new Date(mission.startsAt);
    const endsAt = new Date(mission.endsAt);
    const missionTab = resolveMissionTab(startsAt, endsAt, now);
    const targetValue = Number(mission.targetValue ?? 1);
    const currentValue = Math.min(targetValue, Number(progressBySlug.get(mission.slug) ?? 0));
    const medalType =
      missionTab === 'closed' ? 'silver' : (mission.medalType === 'silver' ? 'silver' : 'bronze');

    return {
      id: String(mission._id),
      slug: mission.slug,
      title: mission.title[locale] ?? mission.title.en,
      rules: mission.rules[locale] ?? mission.rules.en,
      dateRange: formatDateRange(startsAt, endsAt),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      remainingSeconds: remainingSecondsForMission(endsAt, now, missionTab),
      currentValue,
      targetValue,
      percent: computePercent(currentValue, targetValue),
      medalType,
    };
  });
}

/** Running missions the user can still work on (not yet completed). */
export async function countAvailableMissions(userId: string): Promise<number> {
  const items = await listMissionsForUser(userId, 'running', 'en');
  return items.filter((item) => item.currentValue < item.targetValue).length;
}
