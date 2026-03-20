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
