/** Récitateurs proposés sur la page Lire (verse-by-verse, CDN islamic.network + alquran.cloud). */
/** Identifiants alquran.cloud / CDN islamic.network (verse-by-verse). */
export const READ_RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Al-Afasy' },
  { id: 'ar.husary', name: 'Cheikh Al-Husary' },
  { id: 'ar.saadghamdi', name: 'Saad Al-Ghamdi' },
  { id: 'ar.abdulsamad', name: 'Abdul Basit Abdul Samad' },
] as const;

export type ReadReciterId = (typeof READ_RECITERS)[number]['id'];
