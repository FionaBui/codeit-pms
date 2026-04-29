import { getApiClient } from './apiClient.js';

export async function listResources() {
  const client = await getApiClient();
  const res = await client.get('/resources');

  return res.data;
}
