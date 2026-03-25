/**
 * Normalizes a string into a URL-safe slug: lowercase, spaces to hyphens, strips non-alphanumeric (except hyphens).
 * @param {string} value
 * @returns {string}
 */
export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Returns the value of a required environment variable.
 * Throws if the variable is missing or empty.
 */
export function getEnv(name) {
  const val = process.env[name];
  if (!val) {
    const err = new Error(`Missing required environment variable: ${name}`);
    err.statusCode = 500;
    throw err;
  }
  return val;
}
