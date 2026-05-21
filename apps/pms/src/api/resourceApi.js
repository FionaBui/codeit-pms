import { getApiClient } from './apiClient.js';

export async function listResources() {
  const res = await getApiClient().get('/resources');
  return res.data.data;
}
