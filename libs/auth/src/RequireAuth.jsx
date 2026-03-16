import { useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { useAuth } from './useAuth';

/**
 * Renders children only when authenticated.
 * If the user is not authenticated, it calls auth.login() once per browser session
 * and shows a loader. This avoids infinite login loops after redirects.
 */
export function RequireAuth({ children }) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const hasTriggeredLoginRef = useRef(false);

  // Initialize from sessionStorage so redirect/remount doesn't re-trigger login
  if (!hasTriggeredLoginRef.current) {
    hasTriggeredLoginRef.current =
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem('auth_login_started') === '1';
  }

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !hasTriggeredLoginRef.current) {
      hasTriggeredLoginRef.current = true;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('auth_login_started', '1');
      }
      login();
    }

    // Once authenticated, clear the flag so future sessions can login again
    if (isAuthenticated) {
      hasTriggeredLoginRef.current = false;
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('auth_login_started');
      }
    }
  }, [isAuthenticated, isLoading, login]);

  if (isLoading || !isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return children;
}
