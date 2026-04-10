import { useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { useDarkMode } from './hooks/useDarkMode';
import Home from './pages/Home';
import HifzPage from './pages/Hifz/index';
import LirePage from './pages/Lire/index';
import Signets from './pages/Signets';
import { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isDark, toggle } = useDarkMode();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'lire':
        return <LirePage />;
      case 'hifz':
        return <HifzPage />;
      case 'signets':
        return <Signets onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-beige-100 dark:bg-gray-950">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        onToggleDark={toggle}
      />
      <main className={`flex-1 ${currentPage === 'lire' ? '' : ''}`}>
        <div key={currentPage} className="page-transition">
          {renderPage()}
        </div>
      </main>
      {currentPage !== 'lire' && <Footer />}
    </div>
  );
}
