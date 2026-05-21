import { getApiClient } from './apiClient.js';

export async function listResources() {
  const res = await getApiClient().get('/resources');
  return res.data.data;
}

export async function createResource(payload) {
  const res = await getApiClient().post('/resources', payload);

  return res.data.data;
}

export async function updateResource(resourceId, payload) {
  const res = await getApiClient().put(`/resources/${resourceId}`, payload);

  return res.data.data;
}

export async function deleteResource(resourceId) {
  const res = await getApiClient().delete(`/resources/${resourceId}`);

  return res.data.data;
}
