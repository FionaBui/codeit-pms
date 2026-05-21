import { severaFetch } from './severaClient.js';

function throwSeveraError(status, text) {
  const err = new Error(`Severa API error (${status}): ${text}`);
  err.statusCode = status >= 500 ? 502 : status;
  throw err;
}

/**
 * @param {Object} [filters]
 * @param {string}  [filters.pageToken]
 * @param {number}  [filters.rowCount]
 * @param {boolean} [filters.isActive]
 * @param {string}  [filters.changedSince]  - ISO 8601 datetime string
 * @param {string}  [filters.businessUnitGuids]
 * @param {string}  [filters.keywordGuids]
 * @param {string}  [filters.supervisorUserGuids]
 * @returns {Promise<{ data: Array, nextPageToken: string|null }>}
 */
export async function listUsersFromSevera(filters = {}) {
  const params = new URLSearchParams();

  const allowed = ['pageToken', 'rowCount', 'isActive', 'changedSince', 'businessUnitGuids', 'keywordGuids', 'supervisorUserGuids'];
  for (const key of allowed) {
    if (filters[key] !== undefined && filters[key] !== '') {
      params.set(key, filters[key]);
    }
  }

  const query = params.toString();
  const res = await severaFetch(`/users${query ? `?${query}` : ''}`);

  if (!res.ok) {
    const text = await res.text();
    throwSeveraError(res.status, text);
  }

  const data = await res.json();
  const nextPageToken = res.headers.get('NextPageToken') ?? null;

  return { data, nextPageToken };
}

/**
 * @param {string} userId - Severa user GUID
 * @returns {Promise<Object|null>}
 */
export async function getUserByIdFromSevera(userId) {
  const res = await severaFetch(`/users/${encodeURIComponent(userId)}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throwSeveraError(res.status, text);
  }

  return res.json();
}
