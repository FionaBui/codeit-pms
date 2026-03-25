/**
 * @typedef {Object} GetMsalAccessTokenOptions
 * @property {import('@azure/msal-browser').PublicClientApplication} instance - MSAL instance
 * @property {string[]} scopes - Scopes for the token (e.g. api.scopes from config)
 */

/**
 * Gets an access token using MSAL acquireTokenSilent.
 * Returns null if no account, empty scopes, or token cannot be acquired silently.
 *
 * Note: acquireTokenSilent may throw if interaction is required (e.g. consent, re-login).
 * Callers should catch and trigger login (e.g. loginRedirect) when needed.
 *
 * @param {GetMsalAccessTokenOptions} options
 * @returns {Promise<string|null>}
 */
export async function getMsalAccessToken({ instance, scopes }) {
  const normalizedScopes = Array.isArray(scopes) ? scopes.filter(Boolean) : [];
  if (normalizedScopes.length === 0) return null;

  const account =
    instance.getActiveAccount?.() ??
    (Array.isArray(instance.getAllAccounts?.()) ? instance.getAllAccounts()[0] : null);

  if (!account) return null;

  const result = await instance.acquireTokenSilent({
    account,
    scopes: normalizedScopes,
  });

  return typeof result?.accessToken === 'string' && result.accessToken.length > 0 ? result.accessToken : null;
}
