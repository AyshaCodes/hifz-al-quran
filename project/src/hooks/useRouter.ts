import { useState, useCallback, useEffect } from 'react';

export function useRouter() {
  const getPath = () =>
    window.location.hash.replace('#', '') || '/hifz';

  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onHashChange = () => setPath(getPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setPath(to);
  }, []);

  return { path, navigate };
}
