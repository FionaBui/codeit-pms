import { getApiClient } from './apiClient.js';

/**
 * @returns {Promise<Array>}
 */
export async function listProjects() {
  const res = await getApiClient().get('/projects');
  return res.data;
}

/**
 * @param {Object} [params]
 * @returns {Promise<{ data: Array, nextPageToken: string|null }>}
 */
export async function listSeveraProjects(params = {}) {
  const res = await getApiClient().get('/projects/severa', { params });
  return {
    data: res.data.data ?? [],
    nextPageToken: res.headers['nextpagetoken'] ?? null,
  };
}

/**
 * Fetches all Severa projects in one request (server handles pagination).
 * @returns {Promise<Array>}
 */
export async function fetchAllSeveraProjects() {
  const res = await getApiClient().get('/projects/severa/all');
  return res.data.data ?? [];
}

/**
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(id) {
  const res = await getApiClient().get(`/projects/${id}`);
  return res.data;
}

/**
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export async function createProject(project) {
  const res = await getApiClient().post('/projects', project);
  return res.data;
}

/**
 * @param {string} id
 * @param {Object} project
 * @returns {Promise<Object>}
 */
export async function updateProject(id, project) {
  const res = await getApiClient().put(`/projects/${id}`, project);
  return res.data;
}

export async function deleteProject(projectId) {
  return await getApiClient().delete(`/projects/${projectId}`);
}
