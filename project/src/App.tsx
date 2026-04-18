import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useDarkMode } from './hooks/useDarkMode';
import Home from './pages/Home';
import HifzChoice from './pages/hifz';
import HifzAppCustom from './pages/hifz/CustomProgramme/HifzApp';
import GuidedSetup from './pages/hifz/GuidedProgramme/GuidedSetup';
import GuidedDashboard from './pages/hifz/GuidedProgramme/GuidedDashboard';
import LirePage from './pages/Lire';
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
            <Route path="/hifz" element={<HifzChoice />} />
            <Route path="/hifz/custom" element={<HifzAppCustom />} />   
            <Route path="/hifz/guided" element={<GuidedSetup />} />
            <Route path="/hifz/guided/dashboard" element={<GuidedDashboard />} />
            <Route path="/hifz/dashboard" element={<GuidedDashboard />} />
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
