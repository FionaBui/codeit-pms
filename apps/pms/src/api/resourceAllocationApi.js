import { getApiClient } from './apiClient.js';
import { dayjs } from '@codeit/utils';

/**
 * @returns {Promise<Array>}
 */
export async function getResourceAllocationForNextMonths(monthCount) {
  const client = await getApiClient();
  const res = await client.get('/resource-allocations/next-months', {
    params: {
      months: monthCount,
      currentMonth: dayjs().startOf('month').format('YYYY-MM-DD')
    },
    paramsSerializer: { indexes: null }
  });

  return res.data;
}

export async function getResourceAllocationsByProject(projectId, months = 3) {
  const client = await getApiClient();

  const res = await client.get(`/resource-allocations/project/${projectId}`, {
    params: {
      months,
      currentMonth: dayjs().startOf('month').format('YYYY-MM-DD')
    }
  });

  return res.data.data;
}

export async function saveResourceAllocationsByProject(projectId, resources) {
  const client = await getApiClient();

  const res = await client.put(`/resource-allocations/project/${projectId}`, {
    resources
  });
  return res.data.data;
}
