import { createApiClient, getApiBaseUrl, getApiScopes } from '@codeit/api';
import { getMsalAccessToken } from './msalToken.js';

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * @typedef {Object} CreateAuthedApiClientOptions
 * @property {import('@azure/msal-browser').PublicClientApplication} instance - MSAL instance (typically from `useMsal()`).
 * @property {string} [configUrl='/config.json'] - Runtime config URL (provides `api.baseUrl` and `api.scopes`).
 * @property {AxiosRequestConfig} [axiosConfig] - Extra Axios options forwarded to `createApiClient`.
 * @property {boolean} [eagerToken=true] - When true (default), tries `acquireTokenSilent` once during creation so consent/login issues surface at init. Set to false to defer the first token fetch until the first request.
 */

/**
 * Creates an Axios client that attaches a fresh MSAL Bearer token on every
 * request. MSAL's internal cache makes per-request `acquireTokenSilent`
 * cheap; the network is only hit when the cached token is close to expiry.
 *
 * If silent acquisition fails because interaction is required, the failing
 * request rejects with `MsalInteractionRequiredError` (see `./msalToken.js`).
 *
 * @param {CreateAuthedApiClientOptions} options
 * @returns {Promise<AxiosInstance>}
 */
export async function createAuthedApiClient({
  instance,
  configUrl = '/config.json',
  axiosConfig,
  eagerToken = true,
}) {
  const [baseUrl, scopes] = await Promise.all([
    getApiBaseUrl({ configUrl }),
    getApiScopes({ configUrl }),
  ]);

  if (eagerToken) {
    await getMsalAccessToken({ instance, scopes });
  }

  return createApiClient({
    baseUrl,
    axiosConfig,
    getToken: () => getMsalAccessToken({ instance, scopes }),
  });
}
