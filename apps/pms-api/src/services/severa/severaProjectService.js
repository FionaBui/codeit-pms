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
 * @param {string}  [filters.changedSince]            - ISO 8601 datetime
 * @param {string}  [filters.customerGuids]
 * @param {string}  [filters.projectGuids]
 * @param {string}  [filters.projectStatusTypeGuids]
 * @param {string}  [filters.projectOwnerGuids]
 * @param {string}  [filters.salesPersonGuids]
 * @param {string}  [filters.businessUnitGuids]
 * @param {string}  [filters.customerOwnerGuids]
 * @param {string}  [filters.projectMemberUserGuids]
 * @param {string}  [filters.projectKeywordGuids]
 * @param {string}  [filters.salesStatusTypeGuids]
 * @param {string}  [filters.companyCurrencyGuids]
 * @param {string}  [filters.marketSegmentationGuids]
 * @param {string}  [filters.numbers]
 * @param {string}  [filters.invoiceableDate]
 * @returns {Promise<{ data: Array, nextPageToken: string|null }>}
 */
export async function listProjectsFromSevera(filters = {}) {
  const allowed = [
    'pageToken',
    'rowCount',
    'changedSince',
    'customerGuids',
    'projectGuids',
    'projectStatusTypeGuids',
    'projectOwnerGuids',
    'salesPersonGuids',
    'businessUnitGuids',
    'customerOwnerGuids',
    'projectMemberUserGuids',
    'projectKeywordGuids',
    'salesStatusTypeGuids',
    'companyCurrencyGuids',
    'marketSegmentationGuids',
    'numbers',
    'invoiceableDate'
  ];

  const params = new URLSearchParams();
  for (const key of allowed) {
    const value = filters[key];
    if (value === undefined || value === '' || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();
  const res = await severaFetch(`/projects${query ? `?${query}` : ''}`);

  if (!res.ok) {
    const text = await res.text();
    throwSeveraError(res.status, text);
  }

  const data = await res.json();
  const nextPageToken = res.headers.get('NextPageToken') ?? null;

  return { data, nextPageToken };
}

/**
 * Fetches ALL projects from Severa by automatically paginating through every page.
 *
 * @param {Omit<Parameters<typeof listProjectsFromSevera>[0], 'pageToken'>} [filters]
 * @returns {Promise<Array>}
 */
export async function fetchAllProjectsFromSevera(filters = {}) {
  const all = [];
  let pageToken = null;

  do {
    const { data, nextPageToken } = await listProjectsFromSevera({
      ...filters,
      ...(pageToken ? { pageToken } : {}),
    });

    all.push(...data);
    pageToken = nextPageToken;
  } while (pageToken);

  return all;
}
