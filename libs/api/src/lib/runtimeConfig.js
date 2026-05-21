/**
 * Runtime configuration loader.
 *
 * Loads a JSON file (default `/config.json`) at runtime so the same build
 * can be deployed to different environments. Caches the in-flight and
 * resolved promise per `configUrl`. Failed loads are *not* cached, so a
 * retry can succeed once the file becomes available.
 */

/**
 * @typedef {Object} RuntimeConfig
 * @property {Object<string, unknown>=} msal
 * @property {{ baseUrl?: string, scopes?: string[] }=} api
 */

/**
 * @typedef {Object} LoadRuntimeConfigOptions
 * @property {string} [configUrl='/config.json'] - URL to fetch config from.
 * @property {boolean} [throwOnError=false] - If true, rethrow on fetch/parse failure instead of returning {}.
 */

/** @type {Promise<RuntimeConfig> | null} */
let cachedPromise = null;
/** @type {string | null} */
let cachedConfigUrl = null;

/**
 * Loads runtime config from `configUrl`.
 *
 * Result is cached for the lifetime of the page (per URL). Failed loads
 * invalidate the cache so subsequent calls can retry.
 *
 * @param {LoadRuntimeConfigOptions} [options]
 * @returns {Promise<RuntimeConfig>}
 */
export function loadRuntimeConfig(options = {}) {
  const configUrl = options.configUrl ?? '/config.json';
  const throwOnError = options.throwOnError ?? false;

  if (cachedPromise && cachedConfigUrl === configUrl) {
    return cachedPromise;
  }

  /** @type {Promise<RuntimeConfig>} */
  const promise = fetchConfig(configUrl).catch((err) => {
    if (cachedPromise === promise) {
      resetRuntimeConfigCache();
    }
    if (throwOnError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[@codeit/api] Failed to load runtime config from ${configUrl}:`, message);
    return /** @type {RuntimeConfig} */ ({});
  });

  cachedPromise = promise;
  cachedConfigUrl = configUrl;
  return promise;
}

/**
 * @param {string} configUrl
 * @returns {Promise<RuntimeConfig>}
 */
async function fetchConfig(configUrl) {
  const res = await fetch(configUrl);
  if (!res.ok) {
    throw new Error(
      `Failed to load runtime config from ${configUrl}: ${res.status} ${res.statusText}`
    );
  }
  return /** @type {RuntimeConfig} */ (await res.json());
}

/**
 * Clears the runtime config cache. Useful for tests or when config URL changes.
 */
export function resetRuntimeConfigCache() {
  cachedPromise = null;
  cachedConfigUrl = null;
}

/**
 * @typedef {Object} GetApiBaseUrlOptions
 * @property {string} [configUrl='/config.json']
 */

/**
 * Reads `api.baseUrl` from runtime config and normalizes it (no trailing slash).
 *
 * @param {GetApiBaseUrlOptions} [options]
 * @returns {Promise<string>}
 */
export async function getApiBaseUrl(options = {}) {
  const configUrl = options.configUrl ?? '/config.json';
  const cfg = await loadRuntimeConfig({ configUrl });
  const baseUrl = typeof cfg?.api?.baseUrl === 'string' ? cfg.api.baseUrl.trim() : '';
  if (!baseUrl) {
    throw new Error(
      `[@codeit/api] Missing required config "api.baseUrl" in ${configUrl}. ` +
        `Expected shape: { "api": { "baseUrl": "https://...", "scopes": ["..."] } }`
    );
  }
  return baseUrl.replace(/\/+$/, '');
}

/**
 * @typedef {Object} GetApiScopesOptions
 * @property {string} [configUrl='/config.json']
 */

/**
 * Reads `api.scopes` from runtime config. Returns `[]` when none are configured.
 *
 * @param {GetApiScopesOptions} [options]
 * @returns {Promise<string[]>}
 */
export async function getApiScopes(options = {}) {
  const cfg = await loadRuntimeConfig({ configUrl: options.configUrl });
  const scopes = Array.isArray(cfg?.api?.scopes) ? cfg.api.scopes : [];
  return scopes
    .filter((s) => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim());
}
