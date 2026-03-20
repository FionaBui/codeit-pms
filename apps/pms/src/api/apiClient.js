import { createAuthedApiClient } from '@codeit/api';

let clientPromise = null;

/**
 * Initialize the API client. Call once at app startup when MSAL instance is ready
 * (e.g. from a component inside MsalProvider).
 *
 * @param {{ instance: import('@azure/msal-browser').PublicClientApplication }} options
 * @returns {Promise<import('axios').AxiosInstance>}
 */
export function initApiClient({ instance }) {
  if (!clientPromise) {
    clientPromise = createAuthedApiClient({ instance });
  }
  return clientPromise;
}

/**
 * Get the API client. Must call initApiClient first (typically from app init).
 *
 * @returns {Promise<import('axios').AxiosInstance>}
 * @throws {Error} If initApiClient has not been called yet
 */
export function getApiClient() {
  if (!clientPromise) {
    throw new Error('API client not initialized. Call initApiClient({ instance }) first (e.g. from ApiClientInit).');
  }
  return clientPromise;
}
