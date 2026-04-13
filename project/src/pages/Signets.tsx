import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bookmark as BookmarkType } from '../types';

export default function Signets() {
  const navigate = useNavigate();
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card p-12 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-beige-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="font-amiri text-2xl text-gray-700 dark:text-gray-300 mb-2">
            Aucun signet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Ajoutez des versets en signet pendant votre lecture pour les retrouver ici.
          </p>
          <button
            onClick={() => navigate('/lire')}
            className="btn-primary text-sm"
          >
            Commencer à lire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-amiri text-3xl text-primary-700 dark:text-primary-400">
            Mes Signets
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {bookmarks.length} verset{bookmarks.length > 1 ? 's' : ''} sauvegardé{bookmarks.length > 1 ? 's' : ''}
          </p>
        </div>
        <BookmarkCheck className="w-8 h-8 text-gold-400" />
      </div>

      <div className="space-y-4 animate-fade-in">
        {bookmarks
          .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
          .map((bookmark) => (
            <div
              key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
              className="card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {bookmark.surahNameArabic}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-mono tabular-nums">
                      {bookmark.surahNumber}:{bookmark.verseNumber} · {bookmark.surahName}
                    </span>
                  </div>

                  <p
                    className="font-arabic text-xl text-gray-800 dark:text-gray-100 leading-loose mb-3"
                    style={{ direction: 'rtl' }}
                  >
                    {bookmark.verseText}
                  </p>

                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    Sauvegardé le {formatDate(bookmark.savedAt)}
                  </p>
                </div>

                <button
                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.verseNumber)}
                  className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                  title="Supprimer ce signet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
