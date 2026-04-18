import { DailyProgress } from '../types/hifz';

export function getRevisionPages(progress: DailyProgress[], _today: string): number[] {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const cutoff = threeDaysAgo.toISOString().split('T')[0];
  return progress
    .filter(
      (p) =>
        p.completed &&
        p.date < cutoff &&
        (!p.lastReviewedAt || p.lastReviewedAt < cutoff) &&
        p.pageNumber !== undefined
    )
    .map((p) => p.pageNumber as number);
}

export function getPagesPerDay(minutesPerDay: number): number {
  if (minutesPerDay <= 15) return 0.25;
  if (minutesPerDay <= 30) return 0.5;
  if (minutesPerDay <= 60) return 1;
  return 2;
}

export function getDaysToFinish(totalPages: number, pagesPerDay: number, daysPerWeek: number): number {
  if (pagesPerDay === 0 || daysPerWeek === 0) return Infinity;
  const weeksNeeded = totalPages / (pagesPerDay * daysPerWeek);
  return Math.ceil(weeksNeeded * 7);
}

export function getWeeklyStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let current = new Date();
  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    const diffDays = Math.floor(
      (current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1 && entry.completed) {
      streak++;
      current = entryDate;
    } else {
      break;
    }
  }
  return streak;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
