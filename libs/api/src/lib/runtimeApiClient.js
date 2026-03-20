import { createApiClient } from './apiClient.js';
import { getApiBaseUrl } from './runtimeConfig.js';

let cachedClientPromise = null;
let cachedOptions = null;

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * @typedef {Object} RuntimeApiClientOptions
 * @property {string} [configUrl='/config.json'] - Config URL for baseUrl lookup
 * @property {AxiosRequestConfig} [axiosConfig] - Passed to axios.create()
 */

/**
 * Creates (and caches) an Axios client using runtime config (`api.baseUrl`).
 * First call wins: subsequent calls with different options return the same cached client.
 * Call `resetRuntimeApiClientCache()` to clear (e.g. in tests or when config changes).
 *
 * @param {RuntimeApiClientOptions} [options]
 * @returns {Promise<AxiosInstance>}
 */
export function createRuntimeApiClient(options = {}) {
  const opts = { configUrl: options.configUrl, axiosConfig: options.axiosConfig };

  if (cachedClientPromise && cachedOptions?.configUrl === opts.configUrl) {
    return cachedClientPromise;
  }

  cachedOptions = opts;
  cachedClientPromise = getApiBaseUrl({ configUrl: opts.configUrl }).then((baseUrl) =>
    createApiClient({
      baseUrl,
      axiosConfig: opts.axiosConfig,
    })
  );

  return cachedClientPromise;
}

/**
 * Clears the runtime API client cache. Call after config changes or in tests.
 */
export function resetRuntimeApiClientCache() {
  cachedClientPromise = null;
  cachedOptions = null;
}
