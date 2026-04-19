import { Bookmark, BookmarkCheck, Trash2, Search, Tag, StickyNote, Edit2, Check, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bookmark as BookmarkType } from '../types';

const CATEGORIES = ['Mémorisation', 'Révision', 'Inspiration', 'Tajwid', 'Dua'];

export default function Signets() {
  const { navigate } = useRouter();
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>('hifz-bookmarks', []);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const removeBookmark = (surahNumber: number, verseNumber: number) => {
    setBookmarks(bookmarks.filter(
      (b) => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
    ));
  };

  const startEditing = (bookmark: BookmarkType) => {
    setEditingId(`${bookmark.surahNumber}-${bookmark.verseNumber}`);
    setEditNote(bookmark.note || '');
    setEditCategory(bookmark.category || '');
  };

  const saveEdit = (surahNumber: number, verseNumber: number) => {
    setBookmarks(bookmarks.map(b => 
      (b.surahNumber === surahNumber && b.verseNumber === verseNumber)
        ? { ...b, note: editNote, category: editCategory }
        : b
    ));
    setEditingId(null);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filteredBookmarks = bookmarks
    .filter(b => {
      const matchesSearch = 
        b.surahName.toLowerCase().includes(search.toLowerCase()) ||
        b.verseText.toLowerCase().includes(search.toLowerCase()) ||
        (b.note && b.note.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = !selectedCategory || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

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
      <div className="section-container max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200 dark:border-white/5 pb-8">
          <div>
            <h1 className="section-title">Mes Signets</h1>
            <p className="section-subtitle mb-0">
              {bookmarks.length} verset{bookmarks.length > 1 ? 's' : ''} précieux sauvegardé{bookmarks.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-stone-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-full sm:w-64 transition-all"
              />
            </div>
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/20 rotate-3 shrink-0 hidden md:flex">
              <BookmarkCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${!selectedCategory ? 'bg-primary-600 text-white shadow-lg' : 'bg-white dark:bg-gray-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-white/10'}`}
          >
            Tous
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat ? 'bg-primary-600 text-white shadow-lg' : 'bg-white dark:bg-gray-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-white/10'}`}
            >
              <Tag className="w-3 h-3" />
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bookmark) => {
              const isEditing = editingId === `${bookmark.surahNumber}-${bookmark.verseNumber}`;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
                  className="premium-card p-8 group relative overflow-hidden"
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
                        {bookmark.category && !isEditing && (
                          <span className="bg-gold-50 dark:bg-gold-900/40 text-gold-700 dark:text-gold-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {bookmark.category}
                          </span>
                        )}
                      </div>

                      <p
                        className="font-arabic text-2xl sm:text-3xl text-gray-800 dark:text-gray-100 leading-[2.5] mb-8 font-normal"
                        style={{ direction: 'rtl', wordSpacing: '0.1em' }}
                      >
                        {bookmark.verseText}
                      </p>

                      <div className="space-y-4">
                        {isEditing ? (
                          <div className="space-y-4 bg-stone-50 dark:bg-black/20 p-6 rounded-2xl border border-stone-200 dark:border-white/10">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Note personnelle</label>
                              <textarea 
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                placeholder="Ajouter une réflexion, un point de Tajwid..."
                                className="w-full p-4 bg-white dark:bg-gray-900 border border-stone-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none dark:text-white"
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Catégorie</label>
                              <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                  <button 
                                    key={cat}
                                    onClick={() => setEditCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${editCategory === cat ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-stone-500 border border-stone-200 dark:border-white/10'}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                                <button 
                                  onClick={() => setEditCategory('')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${editCategory === '' ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-gray-800 text-stone-500 border border-stone-200 dark:border-white/10'}`}
                                >
                                  Aucune
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                              <button 
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-200 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
                              >
                                <X className="w-4 h-4" /> Annuler
                              </button>
                              <button 
                                onClick={() => saveEdit(bookmark.surahNumber, bookmark.verseNumber)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20"
                              >
                                <Check className="w-4 h-4" /> Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {bookmark.note && (
                              <div className="bg-primary-50/50 dark:bg-primary-900/10 p-5 rounded-2xl border border-primary-100/50 dark:border-primary-800/20 relative group/note">
                                <StickyNote className="w-4 h-4 text-primary-600 dark:text-primary-400 absolute -top-2 -left-2 bg-white dark:bg-gray-900 rounded-full p-0.5 shadow-sm" />
                                <p className="text-sm text-stone-600 dark:text-stone-300 italic leading-relaxed">
                                  "{bookmark.note}"
                                </p>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-white/5">
                              <p className="text-stone-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                                Sauvegardé le {formatDate(bookmark.savedAt)}
                              </p>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => startEditing(bookmark)}
                                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 text-stone-400 hover:text-primary-600 transition-all"
                                  title="Modifier"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.verseNumber)}
                                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-500 transition-all"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredBookmarks.length === 0 && (
            <div className="text-center py-20 bg-stone-50 dark:bg-gray-900/20 rounded-[2rem] border-2 border-dashed border-stone-200 dark:border-white/5">
              <Filter className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
              <p className="text-stone-500 dark:text-stone-400">Aucun résultat ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
