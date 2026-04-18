import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from '../hooks/useRouter';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bookmark as BookmarkType } from '../types';

export default function Signets() {
  const { navigate } = useRouter();
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>('hifz-bookmarks', []);

  const removeBookmark = (surahNumber: number, verseNumber: number) => {
    setBookmarks(bookmarks.filter(
      (b) => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
    ));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (bookmarks.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="premium-card p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-stone-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-stone-300 dark:text-stone-600" />
          </div>
          <h2 className="section-title text-2xl mb-3">
            Aucun signet
          </h2>
          <p className="section-subtitle text-sm mb-8 leading-relaxed">
            Ajoutez des versets en signet pendant votre lecture pour les retrouver facilement ici.
          </p>
          <button
            onClick={() => navigate('/lire')}
            className="btn-premium w-full justify-center"
          >
            Commencer à lire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="section-container max-w-4xl">
        <div className="flex items-end justify-between mb-12 border-b border-stone-200 dark:border-white/5 pb-8">
          <div>
            <h1 className="section-title">Mes Signets</h1>
            <p className="section-subtitle mb-0">
              {bookmarks.length} verset{bookmarks.length > 1 ? 's' : ''} précieux sauvegardé{bookmarks.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/20 rotate-3">
            <BookmarkCheck className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="grid gap-6">
          {bookmarks
            .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
            .map((bookmark) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
                className="premium-card p-8 group relative"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-6">
                      <span className="bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        {bookmark.surahNameArabic}
                      </span>
                      <span className="text-stone-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                        {bookmark.surahNumber}:{bookmark.verseNumber} · {bookmark.surahName}
                      </span>
                    </div>

                    <p
                      className="font-arabic text-2xl text-gray-800 dark:text-gray-100 leading-[1.8] mb-6"
                      style={{ direction: 'rtl' }}
                    >
                      {bookmark.verseText}
                    </p>

                    <p className="text-stone-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                      Ajouté le {formatDate(bookmark.savedAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeBookmark(bookmark.surahNumber, bookmark.verseNumber)}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-gray-800 text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                    title="Supprimer ce signet"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
