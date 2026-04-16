export interface Juz {
  numero: number;
  nom: string;
  souratePrincipale: string;
  pageDebut: number;
  pageFin: number;
}

export const JUZ_LIST: Juz[] = [
  { numero: 1, nom: 'Alif Lam Mim', souratePrincipale: 'Al-Fatiha / Al-Baqara', pageDebut: 1, pageFin: 21 },
  { numero: 2, nom: 'Sayaqul', souratePrincipale: 'Al-Baqara', pageDebut: 22, pageFin: 41 },
  { numero: 3, nom: 'Tilka ar-Rusul', souratePrincipale: 'Al-Baqara / Al-Imran', pageDebut: 42, pageFin: 61 },
  { numero: 4, nom: 'Lan Tanalu', souratePrincipale: 'Al-Imran / An-Nisa', pageDebut: 62, pageFin: 81 },
  { numero: 5, nom: 'Wal Muhsanat', souratePrincipale: 'An-Nisa', pageDebut: 82, pageFin: 101 },
  { numero: 6, nom: 'La Yuhibbu Allah', souratePrincipale: 'An-Nisa / Al-Maida', pageDebut: 102, pageFin: 121 },
  { numero: 7, nom: 'Wa Idha Samiu', souratePrincipale: 'Al-Maida / Al-An\'am', pageDebut: 122, pageFin: 141 },
  { numero: 8, nom: 'Wa Law Annana', souratePrincipale: 'Al-An\'am / Al-A\'raf', pageDebut: 142, pageFin: 161 },
  { numero: 9, nom: 'Qala al-Mala', souratePrincipale: 'Al-A\'raf / Al-Anfal', pageDebut: 162, pageFin: 181 },
  { numero: 10, nom: 'Wa A\'lamu', souratePrincipale: 'Al-Anfal / At-Tawba', pageDebut: 182, pageFin: 201 },
  { numero: 11, nom: 'Ya\'tadhirun', souratePrincipale: 'At-Tawba / Yunus', pageDebut: 202, pageFin: 221 },
  { numero: 12, nom: 'Wa Ma min Dabbah', souratePrincipale: 'Hud / Yusuf', pageDebut: 222, pageFin: 241 },
  { numero: 13, nom: 'Wa Ma Ubarri\'u', souratePrincipale: 'Yusuf / Ibrahim', pageDebut: 242, pageFin: 261 },
  { numero: 14, nom: 'Rubama', souratePrincipale: 'Al-Hijr / An-Nahl', pageDebut: 262, pageFin: 281 },
  { numero: 15, nom: 'Subhana Alladhi', souratePrincipale: 'Al-Isra / Al-Kahf', pageDebut: 282, pageFin: 301 },
  { numero: 16, nom: 'Qala Alam', souratePrincipale: 'Al-Kahf / Ta-Ha', pageDebut: 302, pageFin: 321 },
  { numero: 17, nom: 'Iqtaraba', souratePrincipale: 'Al-Anbiya / Al-Hajj', pageDebut: 322, pageFin: 341 },
  { numero: 18, nom: 'Qad Aflaha', souratePrincipale: 'Al-Mu\'minun / Al-Furqan', pageDebut: 342, pageFin: 361 },
  { numero: 19, nom: 'Wa Qala Alladhina', souratePrincipale: 'Al-Furqan / An-Naml', pageDebut: 362, pageFin: 381 },
  { numero: 20, nom: 'Aman Khalaqa', souratePrincipale: 'An-Naml / Al-Ankabut', pageDebut: 382, pageFin: 401 },
  { numero: 21, nom: 'Utlu Ma Uhiya', souratePrincipale: 'Al-Ankabut / Al-Ahzab', pageDebut: 402, pageFin: 421 },
  { numero: 22, nom: 'Wa Man Yaqnut', souratePrincipale: 'Al-Ahzab / Ya-Sin', pageDebut: 422, pageFin: 441 },
  { numero: 23, nom: 'Wa Mali', souratePrincipale: 'Ya-Sin / Az-Zumar', pageDebut: 442, pageFin: 461 },
  { numero: 24, nom: 'Fa Man Azlam', souratePrincipale: 'Az-Zumar / Fussilat', pageDebut: 462, pageFin: 481 },
  { numero: 25, nom: 'Ilayhi Yuraddu', souratePrincipale: 'Fussilat / Al-Jathiya', pageDebut: 482, pageFin: 501 },
  { numero: 26, nom: 'Ha Mim', souratePrincipale: 'Al-Ahqaf / Az-Zariyat', pageDebut: 502, pageFin: 521 },
  { numero: 27, nom: 'Qala Fa Ma Khatbukum', souratePrincipale: 'Az-Zariyat / Al-Hadid', pageDebut: 522, pageFin: 541 },
  { numero: 28, nom: 'Qad Sami\'a Allah', souratePrincipale: 'Al-Mujadila / At-Tahrim', pageDebut: 542, pageFin: 561 },
  { numero: 29, nom: 'Tabaraka Alladhi', souratePrincipale: 'Al-Mulk / Al-Mursalat', pageDebut: 562, pageFin: 581 },
  { numero: 30, nom: 'Amma Yatasaʼalun', souratePrincipale: 'An-Naba / An-Nas', pageDebut: 582, pageFin: 604 },
];

export const TOTAL_PAGES = 604;
export const PAGES_PAR_JUZ = 20;

export const getJuzName = (numero: number): string => {
  const juz = JUZ_LIST.find(j => j.numero === numero);
  return juz ? `Juz ${numero} — ${juz.souratePrincipale}` : `Juz ${numero}`;
};

export const getSourateForPage = (page: number): string => {
  const juz = JUZ_LIST.find(j => page >= j.pageDebut && page <= j.pageFin);
  return juz ? juz.souratePrincipale : 'Inconnu';
};
