import axios from 'axios';

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * @typedef {Object} ApiClientOptions
 * @property {string} baseUrl - API base URL (trailing slashes removed)
 * @property {string|null} [accessToken] - Bearer token; if provided, sets Authorization header
 * @property {AxiosRequestConfig} [axiosConfig] - Passed to axios.create()
 */

/**
 * Creates an Axios client with baseURL and optional Bearer token.
 * Use this when you have baseUrl and token already (e.g. from runtime config + MSAL).
 *
 * @param {ApiClientOptions} options
 * @returns {AxiosInstance}
 */
export function createApiClient({ baseUrl, accessToken, axiosConfig = {} }) {
  const url = (baseUrl ?? '').toString().replace(/\/+$/, '');
  const client = axios.create({
    baseURL: url,
    ...axiosConfig,
  });

  if (accessToken && typeof accessToken === 'string' && accessToken.trim()) {
    const headers = client.defaults.headers;
    if (headers?.common) {
      headers.common.Authorization = `Bearer ${accessToken.trim()}`;
    } else {
      client.defaults.headers = client.defaults.headers ?? {};
      client.defaults.headers.Authorization = `Bearer ${accessToken.trim()}`;
    }
  }

  return client;
}
