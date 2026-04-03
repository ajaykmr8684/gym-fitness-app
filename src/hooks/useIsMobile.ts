import { useEffect, useState } from 'react';

export const useIsMobile = (breakpoint = 768) => {
  const getValue = () => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
  const [isMobile, setIsMobile] = useState(getValue);

  useEffect(() => {
    const onResize = () => setIsMobile(getValue());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
};
