import { getApiClient } from './apiClient.js';

export async function listResources() {
  const client = await getApiClient();
  const res = await client.get('/resources');

  return res.data.data;
}

export async function createResource(payload) {
  const client = await getApiClient();

  const res = await client.post('/resources', payload);

  return res.data.data;
}

export async function updateResource(resourceId, payload) {
  const client = await getApiClient();

  const res = await client.put(`/resources/${resourceId}`, payload);

  return res.data.data;
}

export async function deleteResource(resourceId) {
  const client = await getApiClient();

  const res = await client.delete(`/resources/${resourceId}`);

  return res.data.data;
}
