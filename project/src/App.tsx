import { useEffect, useState } from 'react';
import { useRouter } from './hooks/useRouter';
import HifzChoice from './pages/Hifz/index';
import HifzApp from './pages/Hifz/CustomProgramme/HifzApp';
import GuidedApp from './pages/Hifz/GuidedProgramme/GuidedApp';

function App() {
  const { path, navigate } = useRouter();

  const [hasCustomProfile, setHasCustomProfile] = useState(false);
  const [hasGuidedProfile, setHasGuidedProfile] = useState(false);

  useEffect(() => {
    setHasCustomProfile(!!localStorage.getItem('hifz-profile'));
    setHasGuidedProfile(!!localStorage.getItem('hifz-guided-profile'));
  }, [path]);

  useEffect(() => {
    if (!path || path === '/' || path === '') {
      navigate('/hifz');
    }
  }, [path, navigate]);

  if (path === '/hifz/custom') {
    return <HifzApp onBack={() => navigate('/hifz')} />;
  }

  if (path === '/hifz/guided') {
    return <GuidedApp onBack={() => navigate('/hifz')} />;
  }

  return (
    <HifzChoice
      onSelectCustom={() => navigate('/hifz/custom')}
      onSelectGuided={() => navigate('/hifz/guided')}
      hasCustomProfile={hasCustomProfile}
      hasGuidedProfile={hasGuidedProfile}
    />
  );
}

export default App;
