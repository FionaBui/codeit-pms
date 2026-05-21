import { InteractionRequiredAuthError } from '@azure/msal-browser';

/**
 * Thrown when MSAL needs interactive sign-in (consent, expired refresh
 * token, conditional access, etc.). Callers should respond by triggering
 * `instance.loginRedirect()` or `instance.acquireTokenRedirect()`.
 */
export class MsalInteractionRequiredError extends Error {
  /**
   * @param {string} message
   * @param {{ cause?: unknown }} [opts]
   */
  constructor(message, opts = {}) {
    super(message);
    this.name = 'MsalInteractionRequiredError';
    if (opts.cause !== undefined) this.cause = opts.cause;
  }
}

/**
 * @typedef {Object} GetMsalAccessTokenOptions
 * @property {import('@azure/msal-browser').PublicClientApplication} instance
 * @property {string[]} scopes
 */

/**
 * Gets an access token via `acquireTokenSilent`.
 *
 * Returns `null` when there is no signed-in account or no scopes were
 * requested. Throws `MsalInteractionRequiredError` when MSAL signals that
 * interactive sign-in is required. Any other MSAL error is rethrown as-is.
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

  try {
    const result = await instance.acquireTokenSilent({
      account,
      scopes: normalizedScopes,
    });
    return typeof result?.accessToken === 'string' && result.accessToken.length > 0
      ? result.accessToken
      : null;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      throw new MsalInteractionRequiredError(
        'MSAL silent token acquisition failed; interactive sign-in is required.',
        { cause: err }
      );
    }
    throw err;
  }
}
