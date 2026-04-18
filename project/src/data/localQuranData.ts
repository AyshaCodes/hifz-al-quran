// Données locales essentielles pour éviter les requêtes API
// Contient les sourates les plus couramment utilisées

export interface LocalVerse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio?: string;
}

export interface LocalSurah {
  number: number;
  name: string;
  englishName: string;
  verses: LocalVerse[];
}

// Sourates fondamentales avec leurs traductions
export const LOCAL_SURAHS: Record<number, LocalSurah> = {
  1: {
    number: 1,
    name: "Al-Fatiha",
    englishName: "The Opening",
    verses: [
      {
        number: 1,
        numberInSurah: 1,
        text: "bismi llahi r-rahmani r-rahim",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        number: 2,
        numberInSurah: 2,
        text: "al-hamdu lillahi rabbi l-alamina",
        translation: "Praise be to Allah, Lord of the worlds."
      },
      {
        number: 3,
        numberInSurah: 3,
        text: "ar-rahmani r-rahim",
        translation: "The Entirely Merciful, the Especially Merciful."
      },
      {
        number: 4,
        numberInSurah: 4,
        text: "maliki yawmi d-din",
        translation: "Sovereign of the Day of Recompense."
      },
      {
        number: 5,
        numberInSurah: 5,
        text: "iyyaka na budu wa iyyaka nasta in",
        translation: "It is You we worship and You we ask for help."
      },
      {
        number: 6,
        numberInSurah: 6,
        text: "ihdina s-sirata l-mustaqim",
        translation: "Guide us to the straight path."
      },
      {
        number: 7,
        numberInSurah: 7,
        text: "sirata lladhina an amta alayhim ghayri l-maghdubi alayhim wa la d-dallin",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
      }
    ]
  },
  112: {
    number: 112,
    name: "Al-Ikhlas",
    englishName: "Sincerity",
    verses: [
      {
        number: 1,
        numberInSurah: 1,
        text: "qul huwa llahu ahad",
        translation: "Say, He is Allah, One."
      },
      {
        number: 2,
        numberInSurah: 2,
        text: "allahu s-samad",
        translation: "Allah, the Eternal Refuge."
      },
      {
        number: 3,
        numberInSurah: 3,
        text: "lam yalid wa lam yulad",
        translation: "He neither begets nor is born."
      },
      {
        number: 4,
        numberInSurah: 4,
        text: "wa lam yakun lahu kufuwan ahad",
        translation: "Nor is there to Him any equivalent."
      }
    ]
  },
  113: {
    number: 113,
    name: "Al-Falaq",
    englishName: "The Dawn",
    verses: [
      {
        number: 1,
        numberInSurah: 1,
        text: "qul a udhu bi-rabbi l-falaq",
        translation: "Say, I seek refuge in the Lord of daybreak."
      },
      {
        number: 2,
        numberInSurah: 2,
        text: "min sharri ma khalaq",
        translation: "From the evil of that which He created."
      },
      {
        number: 3,
        numberInSurah: 3,
        text: "wa min sharri ghasiqin idha waqab",
        translation: "And from the evil of darkness when it settles."
      },
      {
        number: 4,
        numberInSurah: 4,
        text: "wa min sharri n-naffathati fi l- uqad",
        translation: "And from the evil of the blowers in knots."
      },
      {
        number: 5,
        numberInSurah: 5,
        text: "wa min sharri hasidin idha hasad",
        translation: "And from the evil of an envier when he envies."
      }
    ]
  },
  114: {
    number: 114,
    name: "An-Nas",
    englishName: "Mankind",
    verses: [
      {
        number: 1,
        numberInSurah: 1,
        text: "qul a udhu bi-rabbi n-nas",
        translation: "Say, I seek refuge in the Lord of mankind."
      },
      {
        number: 2,
        numberInSurah: 2,
        text: "maliki n-nas",
        translation: "Sovereign of mankind."
      },
      {
        number: 3,
        numberInSurah: 3,
        text: "ilahi n-nas",
        translation: "God of mankind."
      },
      {
        number: 4,
        numberInSurah: 4,
        text: "min sharri l-waswasi l-khannas",
        translation: "From the evil of the retreating whisperer."
      },
      {
        number: 5,
        numberInSurah: 5,
        text: "alladhi yuwaswisu fi suduri n-nas",
        translation: "Who whispers [evil] into the breasts of mankind."
      },
      {
        number: 6,
        numberInSurah: 6,
        text: "mina l-jinnati wa n-nas",
        translation: "From among the jinn and mankind."
      }
    ]
  }
};

// Fonction pour vérifier si une sourate est disponible localement
export function isSurahAvailableLocally(surahNumber: number): boolean {
  return surahNumber in LOCAL_SURAHS;
}

// Fonction pour obtenir une sourate locale
export function getLocalSurah(surahNumber: number): LocalSurah | null {
  return LOCAL_SURAHS[surahNumber] || null;
}

// Fonction pour obtenir les versets d'une sourate locale
export function getLocalVerses(surahNumber: number): LocalVerse[] | null {
  const surah = LOCAL_SURAHS[surahNumber];
  return surah ? surah.verses : null;
}
