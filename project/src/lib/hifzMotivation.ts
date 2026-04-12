const MESSAGES = [
  'Un quart de page solide vaut mieux qu\'une page fragile 🤍',
  'Demande l\'aide d\'Allah avant de commencer.',
  'La révision protège ce que tu as acquis.',
  'Petit à petit, on remplit l\'océan.',
  'Ne saute jamais 2 jours consécutifs.',
] as const;

/** Message stable pour la journée (change chaque jour). */
export function getDailyMotivationalMessage(date: Date = new Date()): string {
  const t = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  return MESSAGES[t % MESSAGES.length];
}
