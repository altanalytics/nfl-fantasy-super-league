import { useEffect } from 'react';
import { logPageAccess } from './logAccess';

export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    const email = localStorage.getItem('authorizedEmail');
    if (email) {
      logPageAccess(email, pageName);
    }
  }, [pageName]);
};
