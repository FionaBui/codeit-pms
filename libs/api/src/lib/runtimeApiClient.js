import { createApiClient } from './apiClient.js';
import { getApiBaseUrl } from './runtimeConfig.js';

/**
 * @typedef {Object} RuntimeApiClientOptions
 * @property {string} [configUrl='/config.json'] - Config URL providing `api.baseUrl`.
 * @property {import('./apiClient.js').CreateApiClientOptions['axiosConfig']} [axiosConfig]
 * @property {import('./apiClient.js').CreateApiClientOptions['accessToken']} [accessToken]
 * @property {import('./apiClient.js').CreateApiClientOptions['getToken']} [getToken]
 * @property {import('./apiClient.js').CreateApiClientOptions['onRequest']} [onRequest]
 * @property {import('./apiClient.js').CreateApiClientOptions['onResponse']} [onResponse]
 * @property {import('./apiClient.js').CreateApiClientOptions['onError']} [onError]
 */

/**
 * Creates an Axios client using `api.baseUrl` from runtime config.
 *
 * Does *not* cache the resulting client — apps that need a singleton should
 * wrap this in their own cache to make ownership explicit.
 *
 * @param {RuntimeApiClientOptions} [options]
 * @returns {Promise<import('axios').AxiosInstance>}
 */
export async function createRuntimeApiClient(options = {}) {
  const { configUrl, axiosConfig, accessToken, getToken, onRequest, onResponse, onError } =
    options;
  const baseUrl = await getApiBaseUrl({ configUrl });
  return createApiClient({
    baseUrl,
    axiosConfig,
    accessToken,
    getToken,
    onRequest,
    onResponse,
    onError,
  });
}
