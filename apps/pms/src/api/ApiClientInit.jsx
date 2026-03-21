import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Spin } from 'antd';
import { initApiClient } from './apiClient.js';

/**
 * Initializes the API client when MSAL is ready. Renders children once init completes.
 * Waits for MSAL to finish (inProgress === None) before requesting API token to avoid race.
 * Place inside MsalProvider and RequireAuth.
 */
export function ApiClientInit({ children }) {
  const { instance, inProgress } = useMsal();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;

    let mounted = true;

    initApiClient({ instance })
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((e) => {
        if (mounted) setError(e);
      });

    return () => {
      mounted = false;
    };
  }, [instance, inProgress]);

  if (error) {
    const msg = String(error?.message ?? error);
    const needsConsent = /70000|unauthorized|consent/i.test(msg);
    return (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <p style={{ fontWeight: 500, marginBottom: 8 }}>Failed to initialize API client</p>
        <p style={{ marginBottom: 8, color: '#666' }}>{msg}</p>
        {needsConsent && (
          <p style={{ fontSize: 13, color: '#888' }}>
            Ensure the API scope is exposed in Azure (Expose an API) and the app has the permission (API permissions → Add → My APIs). Grant admin consent if required.
          </p>
        )}
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return children;
}
