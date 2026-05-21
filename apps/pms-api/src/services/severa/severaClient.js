const SEVERA_BASE_URL = 'https://api.severa.visma.com/psapublicrest/v1';
const TOKEN_URL = `${SEVERA_BASE_URL}/login/oauth/access_token`;
const TOKEN_EXPIRY_BUFFER_MS = 60_000; // refresh 60s before actual expiry

let cachedToken = null;

async function fetchNewToken() {
  const clientId = process.env.SEVERA_CLIENT_ID;
  const clientSecret = process.env.SEVERA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SEVERA_CLIENT_ID and SEVERA_CLIENT_SECRET must be set in environment variables.');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_Id: clientId,
      client_Secret: clientSecret,
      scope: 'projects:read users:read hours:read',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Severa token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.access_token_expires_in * 1000) - TOKEN_EXPIRY_BUFFER_MS,
  };

  return cachedToken.accessToken;
}

async function getToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }
  return fetchNewToken();
}

/**
 * Makes an authenticated request to the Severa PSA REST API.
 *
 * @param {string} path - API path (e.g. '/users/abc-123')
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function severaFetch(path, options = {}) {
  const token = await getToken();

  const res = await fetch(`${SEVERA_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // On 401, try once with a fresh token (in case of clock skew or early revocation)
  if (res.status === 401) {
    cachedToken = null;
    const freshToken = await fetchNewToken();

    return fetch(`${SEVERA_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${freshToken}`,
        ...options.headers,
      },
    });
  }

  return res;
}
