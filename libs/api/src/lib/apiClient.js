import axios from 'axios';

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('axios').InternalAxiosRequestConfig} InternalAxiosRequestConfig
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 */

/**
 * @callback GetTokenFn
 * @returns {Promise<string|null|undefined>}
 */

/**
 * @callback RequestInterceptor
 * @param {InternalAxiosRequestConfig} config
 * @returns {InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>}
 */

/**
 * @callback ResponseInterceptor
 * @param {AxiosResponse} response
 * @returns {AxiosResponse | Promise<AxiosResponse>}
 */

/**
 * @callback ErrorInterceptor
 * @param {unknown} error
 * @returns {unknown}
 */

/**
 * @typedef {Object} CreateApiClientOptions
 * @property {string} baseUrl - API base URL (trailing slashes are stripped).
 * @property {string} [accessToken] - Static Bearer token. Use for tokens that don't change per request (PAT, API key, env-injected secret). Mutually exclusive with `getToken`.
 * @property {GetTokenFn} [getToken] - Called on every request to fetch a fresh token. Use for tokens that rotate (MSAL/OAuth). Auth providers typically cache internally so this is cheap. Mutually exclusive with `accessToken`.
 * @property {AxiosRequestConfig} [axiosConfig] - Additional Axios options (timeout, headers, etc.). `baseURL` is always overridden by `baseUrl`.
 * @property {RequestInterceptor} [onRequest] - Extra request interceptor (runs after the auth interceptor).
 * @property {ResponseInterceptor} [onResponse] - Response interceptor for successful responses.
 * @property {ErrorInterceptor} [onError] - Response interceptor for errors. Must rethrow or return a rejected promise to propagate.
 */

/**
 * Creates a configured Axios client.
 *
 * Auth: pass `accessToken` (static) or `getToken` (dynamic). Both attach
 * `Authorization: Bearer <token>` via a request interceptor so per-request
 * header overrides keep working as expected.
 *
 * @param {CreateApiClientOptions} options
 * @returns {AxiosInstance}
 */
export function createApiClient({
  baseUrl,
  accessToken,
  getToken,
  axiosConfig = {},
  onRequest,
  onResponse,
  onError,
}) {
  if (accessToken != null && getToken != null) {
    throw new Error('[@codeit/api] Pass either `accessToken` or `getToken`, not both.');
  }

  const normalizedBaseUrl = (baseUrl ?? '').toString().replace(/\/+$/, '');
  const client = axios.create({
    ...axiosConfig,
    baseURL: normalizedBaseUrl,
  });

  const resolveToken =
    typeof getToken === 'function'
      ? getToken
      : typeof accessToken === 'string' && accessToken.trim()
        ? () => accessToken
        : null;

  if (resolveToken) {
    client.interceptors.request.use(async (config) => {
      const token = await resolveToken();
      if (typeof token === 'string' && token.trim()) {
        config.headers.set('Authorization', `Bearer ${token.trim()}`);
      }
      return config;
    });
  }

  if (typeof onRequest === 'function') {
    client.interceptors.request.use(onRequest);
  }

  if (typeof onResponse === 'function' || typeof onError === 'function') {
    client.interceptors.response.use(
      onResponse ?? ((r) => r),
      onError ?? ((err) => Promise.reject(err))
    );
  }

  return client;
}
