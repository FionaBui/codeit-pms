import { getApiClient } from './apiClient.js';

/**
 * @returns {Promise<{ data: Array<Record<string, unknown>> }>}
 */
export async function listUsers() {
  const client = await getApiClient();
  const res = await client.get('/users');
  return res.data;
}
