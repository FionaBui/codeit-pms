import { getApiClient } from './apiClient.js';

/**
 * @returns {Promise<Array>}
 */
export async function listProjects() {
  const client = await getApiClient();
  const res = await client.get('/projects');

  return res.data.data;
}

/**
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(id) {
  const client = await getApiClient();
  const res = await client.get(`/projects/${id}`);

  return res.data.data;
}

/**
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export async function createProject(project) {
  const client = await getApiClient();
  const res = await client.post('/projects', project);

  return res.data.data;
}

/**
 * @param {string} id
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export async function updateProject(id, project) {
  const client = await getApiClient();
  const res = await client.put(`/projects/${id}`, project);

  return res.data.data;
}

export async function deleteProject(projectId) {
  const client = await getApiClient();
  const res = await client.delete(`/projects/${projectId}`);

  return res.data.data;
}
