import { getApiClient } from './apiClient.js';
import { dayjs } from '@codeit/utils';

/**
 * @returns {Promise<Array>}
 */
export async function getResourceAllocationForNextMonths(months) {
  const client = await getApiClient();
  const res = await client.get('/resource-allocations/next-months', { params: { months, currentMonth: dayjs().startOf('month').format('YYYY-MM-DD') }, paramsSerializer: { indexes: null } });

  return res.data;
}