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
