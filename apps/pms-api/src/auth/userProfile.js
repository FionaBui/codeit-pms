import { fetchUserJobTitleFromGraph } from '../services/graphService.js';

function readJobTitleFromToken(auth) {
  const jobTitle = auth?.jobTitle;
  return typeof jobTitle === 'string' && jobTitle.trim() ? jobTitle.trim() : null;
}

/**
 * Resolves the authenticated user's job title.
 * 1. Optional claim on the access token (`jobTitle`)
 * 2. Microsoft Graph via on-behalf-of (when AAD_CLIENT_SECRET is configured)
 *
 * @param {{ auth?: object, accessToken?: string }} options
 * @returns {Promise<string|null>}
 */
export async function resolveUserJobTitle({ auth, accessToken }) {
  const fromToken = readJobTitleFromToken(auth);

  if (fromToken) return fromToken;

  if (!accessToken) return null;

  return await fetchUserJobTitleFromGraph({ accessToken, auth });
}
