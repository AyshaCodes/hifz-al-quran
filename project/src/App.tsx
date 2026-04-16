import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useDarkMode } from './hooks/useDarkMode';
import Home from './pages/Home';
import HifzApp from './components/hifz/HifzApp';
import LirePage from './pages/Lire/index';
import Signets from './pages/Signets';
import Ressources from './pages/Ressources';
import Contact from './pages/Contact';

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  const isLire = location.pathname === '/lire';

  return (
    <div className="min-h-screen flex flex-col bg-beige-100 dark:bg-gray-950">
      <Header isDark={isDark} onToggleDark={toggle} />
      <main className="flex-1">
        <div key={location.pathname + location.search} className="page-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lire" element={<LirePage />} />
            <Route path="/hifz" element={<HifzApp />} />
            <Route path="/signets" element={<Signets />} />
            <Route path="/ressources" element={<Ressources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      {!isLire && <Footer />}
    </div>
  );
}
