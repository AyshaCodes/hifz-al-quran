/** Récitateurs proposés sur la page Lire (verse-by-verse, CDN islamic.network + alquran.cloud). */
/** Identifiants alquran.cloud / CDN islamic.network (verse-by-verse). */
export const READ_RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Al-Afasy', shortName: 'Mishary Al-Afasy' },
  { id: 'ar.husary', name: 'Sheikh Husary', shortName: 'Sheikh Husary' },
  { id: 'ar.abdulsamad', name: 'Abdul Basit Abdul Samad', shortName: 'Abdul Basit' },
] as const;

export type ReadReciterId = (typeof READ_RECITERS)[number]['id'];
