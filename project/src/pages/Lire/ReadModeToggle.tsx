export type ReadMode = 'ayah' | 'lecture';

interface ReadModeToggleProps {
  mode: ReadMode;
  onModeChange: (mode: ReadMode) => void;
}

export default function ReadModeToggle({ mode, onModeChange }: ReadModeToggleProps) {
  return (
    <div className="flex justify-center py-3 px-4 bg-white/90 dark:bg-gray-900/90 border-b border-beige-200 dark:border-gray-800 shrink-0">
      <div className="inline-flex rounded-full bg-beige-100 dark:bg-gray-800 p-1 gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('ayah')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'ayah'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Ayah par Ayah
        </button>
        <button
          type="button"
          onClick={() => onModeChange('lecture')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'lecture'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Lecture
        </button>
      </div>
    </div>
  );
}
