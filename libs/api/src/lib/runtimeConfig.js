let cachedPromise = null;
let cachedConfigUrl = null;

/**
 * @typedef {Object} RuntimeConfig
 * @property {Object<string, unknown>=} msal
 * @property {{ baseUrl?: string, scopes?: string[] }=} api
 */

/**
 * @typedef {Object} LoadRuntimeConfigOptions
 * @property {string} [configUrl='/config.json'] - URL to fetch config from (e.g. for tests or different apps)
 * @property {boolean} [throwOnError=false] - If true, rethrow on fetch/parse failure instead of returning {}
 */

/**
 * Loads runtime config from a config URL (default `/config.json`).
 * Cached for the lifetime of the page. Call `resetRuntimeConfigCache()` to clear (e.g. in tests).
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

  cachedConfigUrl = configUrl;
  cachedPromise = fetch(configUrl)
    .then((res) => {
      if (!res.ok) {
        const err = new Error(`Failed to load config from ${configUrl}: ${res.status} ${res.statusText}`);
        if (throwOnError) throw err;
        console.warn(`[@codeit/api] ${err.message}`);
        return {};
      }
      return res.json();
    })
    .catch((err) => {
      if (throwOnError) throw err;
      console.warn(`[@codeit/api] Failed to load config from ${configUrl}:`, err?.message ?? err);
      return {};
    });

  return cachedPromise;
}

/**
 * Clears the runtime config cache. Useful for tests or when config URL changes (e.g. after logout).
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
 * @param {GetApiBaseUrlOptions} [options]
 * @returns {Promise<string>}
 */
export async function getApiBaseUrl(options = {}) {
  const cfg = await loadRuntimeConfig({ configUrl: options.configUrl });
  const baseUrl = cfg?.api?.baseUrl?.trim?.() ?? '';
  if (!baseUrl) {
    throw new Error(`Missing runtime config: api.baseUrl (check config at ${options.configUrl ?? '/config.json'})`);
  }
  return baseUrl.replace(/\/+$/, '');
}

/**
 * @typedef {Object} GetApiScopesOptions
 * @property {string} [configUrl='/config.json']
 */

/**
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
