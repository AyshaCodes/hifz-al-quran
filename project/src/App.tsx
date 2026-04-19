import { useEffect, useState } from 'react';
import { useRouter } from './hooks/useRouter';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LirePage from './pages/Lire/index';
import HifzChoice from './pages/hifz/index';
import HifzApp from './pages/hifz/CustomProgramme/HifzApp';
import GuidedApp from './pages/hifz/GuidedProgramme/GuidedApp';
import Ressources from './pages/Ressources';
import Signets from './pages/Signets';
import Contact from './pages/Contact';

function App() {
  const { path, navigate } = useRouter();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [hasCustomProfile, setHasCustomProfile] = useState(false);
  const [hasGuidedProfile, setHasGuidedProfile] = useState(false);

  useEffect(() => {
    setHasCustomProfile(!!localStorage.getItem('hifz-profile'));
    setHasGuidedProfile(!!localStorage.getItem('hifz-guided-profile'));
  }, [path]);

  useEffect(() => {
    if (!path || path === '') {
      navigate('/');
    }
  }, [path, navigate]);

  const renderContent = () => {
    switch (path) {
      case '/':
      case '':
        return <Home />;
      case '/lire':
        return <LirePage />;
      case '/hifz':
        return (
          <HifzChoice
            onSelectCustom={() => navigate('/hifz/custom')}
            onSelectGuided={() => navigate('/hifz/guided')}
            hasCustomProfile={hasCustomProfile}
            hasGuidedProfile={hasGuidedProfile}
          />
        );
      case '/hifz/custom':
        return <HifzApp onBack={() => navigate('/hifz')} />;
      case '/hifz/guided':
        return <GuidedApp onBack={() => navigate('/hifz')} />;
      case '/ressources':
        return <Ressources />;
      case '/signets':
        return <Signets />;
      case '/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-gray-950 transition-colors duration-500">
      <Header isDark={isDark} onToggleDark={toggleDark} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
