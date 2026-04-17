import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Page d'accueil simplifiée
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Si vous voyez encore des triangles, le problème ne vient pas de Home.tsx
        </p>
        <button
          onClick={() => navigate('/hifz')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Aller à Mon Hifz
        </button>
      </div>
    </div>
  );
}
