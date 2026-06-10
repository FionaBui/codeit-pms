import { Resource } from '../models/Resource.js';

const PMS_ADMIN_ROLE = 'PmsAdmin';

/**
 * Reads the signed-in user's display name from the access token.
 *
 * @param {object} [auth]
 * @returns {string|null}
 */
export function getDisplayNameFromAuth(auth) {
  const name = auth?.name;
  return typeof name === 'string' && name.trim() ? name.trim() : null;
}

/**
 * Finds the resource record that matches the signed-in user's display name.
 *
 * @param {string|null} displayName
 * @returns {Promise<{ _id: string, name: string }|null>}
 */
export async function findResourceByDisplayName(displayName) {
  if (typeof displayName !== 'string' || !displayName.trim()) return null;

  const normalizedName = displayName.trim().toLowerCase();

  const resource = await Resource.findOne({
    $expr: { $eq: [{ $toLower: '$name' }, normalizedName] },
  })
    .select('_id name')
    .lean();

  return resource ?? null;
}

export { PMS_ADMIN_ROLE };
