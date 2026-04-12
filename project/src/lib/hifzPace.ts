/** Créneaux du slider (minutes / jour) — valeurs pédagogiques fixes. */
export const TEMPS_JOUR_STEPS = [15, 30, 45, 60, 90, 120] as const;

export type TempsJourMin = (typeof TEMPS_JOUR_STEPS)[number];

/**
 * Rythme réaliste : mémorisation + révision comprises.
 * 15→¼ page, 30/45→½, 1h→1 page max, 1h30→1 avec révision courante, 2h→1,5 avec révision sérieuse.
 */
export function getPagesPerDayFromMinutes(minutes: number): number {
  const m = snapTempsToStep(minutes);
  switch (m) {
    case 15:
      return 0.25;
    case 30:
    case 45:
      return 0.5;
    case 60:
      return 1;
    case 90:
      return 1;
    case 120:
      return 1.5;
    default:
      return 0.5;
  }
}

export function snapTempsToStep(minutes: number): TempsJourMin {
  const allowed = TEMPS_JOUR_STEPS as readonly number[];
  let best = allowed[0];
  let bestDiff = Math.abs(minutes - best);
  for (const v of allowed) {
    const d = Math.abs(minutes - v);
    if (d < bestDiff) {
      best = v as TempsJourMin;
      bestDiff = d;
    }
  }
  return best;
}

export function formatTempsCourt(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

export function formatPagesFr(n: number): string {
  if (n === 0.25) return '¼ de page';
  if (n === 0.5) return '½ page';
  if (n === 1) return '1 page';
  if (n === 1.5) return '1,5 pages';
  if (n === Math.floor(n)) return `${n} pages`;
  return `${n} page(s)`;
}
