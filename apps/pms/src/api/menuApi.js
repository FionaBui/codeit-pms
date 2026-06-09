import { getApiClient } from './apiClient.js';

export async function listMenus() {
  const res = await getApiClient().get('/menus');
  return res.data.data;
}
