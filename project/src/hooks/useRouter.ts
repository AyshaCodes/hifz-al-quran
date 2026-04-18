import { useState, useCallback, useEffect, useMemo } from 'react';

export function useRouter() {
  const getPath = () =>
    window.location.hash.split('?')[0].replace('#', '') || '/';

  const [path, setPath] = useState(getPath);

  const searchParams = useMemo(() => {
    const search = window.location.hash.split('?')[1] || '';
    return new URLSearchParams(search);
  }, [path]);

  useEffect(() => {
    const onHashChange = () => setPath(getPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setPath(to.split('?')[0]);
  }, []);

  return { path, navigate, searchParams };
}
