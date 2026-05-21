import { createAuthedApiClient } from '@codeit/auth/msal';

/** @type {import('axios').AxiosInstance | null} */
let client = null;

/**
 * Initialize the API client. Call once at app startup when MSAL instance is ready
 * (e.g. from a component inside MsalProvider).
 *
 * @param {{ instance: import('@azure/msal-browser').PublicClientApplication }} options
 * @returns {Promise<import('axios').AxiosInstance>}
 */
export async function initApiClient({ instance }) {
  if (!client) {
    client = await createAuthedApiClient({ instance });
  }
  return client;
}

/**
 * Get the API client. Must call initApiClient first (typically from app init).
 *
 * @returns {import('axios').AxiosInstance}
 * @throws {Error} If initApiClient has not been called yet
 */
export function getApiClient() {
  if (!client) {
    throw new Error('API client not initialized. Call initApiClient({ instance }) first (e.g. from ApiClientInit).');
  }
  return client;
}
