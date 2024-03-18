import { useSyncExternalStore } from 'react';

export const useIsMobile = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

const getSnapshot = () => window.innerWidth < 992;
const getServerSnapshot = () => false;
const subscribe = (update: () => void) => {
  const matcher = matchMedia('(max-width: 992px)');
  matcher.addEventListener('change', update);
  return () => matcher.removeEventListener('change', update);
};
