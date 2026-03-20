import { getApiClient } from './apiClient.js';

/**
 * @returns {Promise<Array>}
 */
export async function listProjects() {
  const client = await getApiClient();
  const res = await client.get('/projects');
  return res.data;
}

/**
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(id) {
  const client = await getApiClient();
  const res = await client.get(`/projects/${id}`);
  return res.data;
}
