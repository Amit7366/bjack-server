import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { REBATE_TZ } from './rebate.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getDayKey(date = new Date()): string {
  return dayjs(date).tz(REBATE_TZ).format('YYYY-MM-DD');
}

export function getDayRange(dayKey: string): { start: Date; end: Date } {
  const start = dayjs.tz(dayKey, REBATE_TZ).startOf('day').toDate();
  const end = dayjs.tz(dayKey, REBATE_TZ).endOf('day').toDate();
  return { start, end };
}

export function parseDayKey(value?: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return getDayKey();
  }
  return value;
}

export function dayKeyToOrderSuffix(dayKey: string): string {
  return dayKey.replace(/-/g, '').slice(2);
}
