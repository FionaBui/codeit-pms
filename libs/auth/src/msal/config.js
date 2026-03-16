/*
 * MSAL config and instance creation. Override at runtime via config.json or pass to createMsalInstance().
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */

import { LogLevel, PublicClientApplication } from '@azure/msal-browser';

export const defaultMsalConfig = {
  auth: {
    clientId: 'Enter_the_Application_Id_Here',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri:
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:4200',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

export const defaultLoginRequest = {
  scopes: ['User.Read'],
};

/**
 * Create an MSAL instance. Merges optional overrides (e.g. from config.json or app config).
 * @param {Object} [overrides] - Partial config to merge (e.g. { auth: { clientId, redirectUri, authority } })
 * @returns {Promise<PublicClientApplication>}
 */
export async function createMsalInstance(overrides = {}) {
  const config = {
    ...defaultMsalConfig,
    auth: { ...defaultMsalConfig.auth, ...overrides },
    cache: overrides.cache ?? defaultMsalConfig.cache,
    system: overrides.system ?? defaultMsalConfig.system,
  };
  const instance = new PublicClientApplication(config);
  await instance.initialize();
  return instance;
}

/**
 * Create MSAL instance with config loaded from /config.json (msal key).
 * @returns {Promise<PublicClientApplication>}
 */
export async function createMsalInstanceFromConfig() {
  const config = await fetch('/config.json')
    .then((res) => res.json())
    .catch(() => ({}));
  return createMsalInstance(config.msal || {});
}
