import { DailyProgress, MemorizationQuality, UserProfile } from '../types';
import { getPagesPerDayFromMinutes, snapTempsToStep } from './hifzPace';

export function getTodayStr(d: Date = new Date()): string {
  return d.toISOString().split('T')[0];
}

export function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function isRevisionOnlyPeriod(profile: UserProfile, dateStr: string = getTodayStr()): boolean {
  if (!profile.revisionOnlyUntil) return false;
  return dateStr <= profile.revisionOnlyUntil;
}

/** Pages nouvelles prévues aujourd'hui (0 si phase révision uniquement). */
export function getDailyMemoGoal(profile: UserProfile, dateStr: string = getTodayStr()): number {
  if (isRevisionOnlyPeriod(profile, dateStr)) return 0;

  const q = memorizationQualityOrDefault(profile.memorizationQuality);
  if (
    q === 'forgotten' &&
    profile.revisionOnlyUntil &&
    dateStr <= profile.revisionOnlyUntil
  ) {
    return 0;
  }

  const base = getPagesPerDayFromMinutes(snapTempsToStep(profile.tempsParJour));
  if (q === 'partial') {
    const halved = base * 0.5;
    return Math.max(0.25, Math.round(halved * 4) / 4);
  }
  return base;
}

export function countSuccessfulMemoCompletions(progress: DailyProgress[]): number {
  return progress.filter((p) => p.completed && p.pageQuality !== 'hard').length;
}

export function getCurrentTargetPage(profile: UserProfile, progress: DailyProgress[]): number {
  const startPage = (profile.juzActuel - 1) * 20 + 1;
  return startPage + countSuccessfulMemoCompletions(progress);
}

export function memorizationQualityOrDefault(q?: MemorizationQuality): MemorizationQuality {
  return q ?? 'good';
}

export function reviewThresholdDays(quality?: MemorizationQuality): number {
  const q = memorizationQualityOrDefault(quality);
  if (q === 'partial') return 1;
  return 3;
}

export interface PlannedDay {
  date: string;
  dayLabel: string;
  mode: 'memorization' | 'revision' | 'kahf';
  targetPages: number;
  fromPage: number;
  toPage: number;
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function getWeeklyPlan(profile: UserProfile, progress: DailyProgress[]): PlannedDay[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = addDays(today, mondayOffset);

  const startPage = getCurrentTargetPage(profile, progress);
  let cursor = startPage;

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const dateStr = toISODate(date);
    const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    const isFriday = date.getDay() === 5;
    const revisionOnly = isRevisionOnlyPeriod(profile, dateStr);
    const goal = getDailyMemoGoal(profile, dateStr);

    if (isFriday) {
      return {
        date: dateStr,
        dayLabel,
        mode: 'kahf',
        targetPages: 0,
        fromPage: cursor,
        toPage: cursor,
      };
    }

    if (revisionOnly || goal <= 0) {
      return {
        date: dateStr,
        dayLabel,
        mode: 'revision',
        targetPages: 0,
        fromPage: cursor,
        toPage: cursor,
      };
    }

    const fromPage = cursor;
    const toPage = Math.max(fromPage, fromPage + Math.ceil(goal) - 1);
    cursor = toPage + 1;

    return {
      date: dateStr,
      dayLabel,
      mode: 'memorization',
      targetPages: goal,
      fromPage,
      toPage,
    };
  });
}
