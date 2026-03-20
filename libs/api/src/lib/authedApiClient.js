import { createApiClient } from './apiClient.js';
import { getApiBaseUrl, getApiScopes } from './runtimeConfig.js';
import { getMsalAccessToken } from './msalToken.js';

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

/**
 * @typedef {Object} CreateAuthedApiClientOptions
 * @property {import('@azure/msal-browser').PublicClientApplication} instance - MSAL instance
 * @property {string} [configUrl='/config.json'] - Config URL for baseUrl and scopes
 */

/**
 * Creates an Axios client with baseUrl and Bearer token from MSAL.
 * Combines getApiBaseUrl, getApiScopes, getMsalAccessToken, and createApiClient.
 * Use in React hooks or any place you have MSAL instance.
 *
 * @param {CreateAuthedApiClientOptions} options
 * @returns {Promise<AxiosInstance>}
 */
export async function createAuthedApiClient({ instance, configUrl = '/config.json' }) {
  const [baseUrl, scopes] = await Promise.all([
    getApiBaseUrl({ configUrl }),
    getApiScopes({ configUrl }),
  ]);
  const accessToken = await getMsalAccessToken({ instance, scopes });

  return createApiClient({ baseUrl, accessToken });
}
