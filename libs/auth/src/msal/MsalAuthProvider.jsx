import { useMemo, useState, useEffect } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Spin } from 'antd';
import { AuthProvider } from '../AuthProvider';
import { defaultLoginRequest } from './config';

/** Adapts MSAL state to the shared AuthContext. Used inside MsalProvider. */
function MsalAuthAdapter({ children, loginRequest = defaultLoginRequest }) {
  const { instance, accounts, inProgress, error } = useMsal();
  const value = useMemo(() => {
    const account = accounts[0];
    return {
      user: account
        ? { id: account.localAccountId, displayName: account.name ?? account.username, email: account.username, raw: account }
        : null,
      isAuthenticated: accounts.length > 0,
      isLoading: inProgress !== InteractionStatus.None,
      error: error ?? null,
      login: () => instance.loginRedirect(loginRequest).catch((e) => console.error(e)),
      logout: () => instance.logoutRedirect().catch((e) => console.error(e)),
    };
  }, [instance, accounts, inProgress, error, loginRequest]);
  return <AuthProvider value={value}>{children}</AuthProvider>;
}

/**
 * MSAL implementation of the shared auth contract. Wrap your app when using Microsoft login.
 * Pass either an existing instance (sync) or getInstance (async, e.g. createMsalInstanceFromConfig).
 *
 * @param {Object} props
 * @param {import('@azure/msal-browser').PublicClientApplication} [props.instance] - Use when you already have an instance
 * @param {() => Promise<PublicClientApplication>} [props.getInstance] - Use for async init (e.g. from config.json); shows loading until ready
 * @param {Object} [props.loginRequest] - Default { scopes: ['User.Read'] }
 */
export function MsalAuthProvider({ instance: instanceProp, getInstance, loginRequest, children }) {
  const [instanceFromAsync, setInstanceFromAsync] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (getInstance && !instanceProp) {
      getInstance().then(setInstanceFromAsync).catch((e) => {
        console.error('MSAL init failed', e);
        setError(e);
      });
    }
  }, [getInstance, instanceProp]);

  const instance = instanceProp ?? instanceFromAsync;

  if (getInstance && !instanceProp) {
    if (error) return <div style={{ padding: 24 }}>Failed to load auth. Check config.</div>;
    if (!instance) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Spin size="large" />
        </div>
      );
    }
  }

  if (!instance) return null;

  return (
    <MsalProvider instance={instance}>
      <MsalAuthAdapter loginRequest={loginRequest}>{children}</MsalAuthAdapter>
    </MsalProvider>
  );
}
