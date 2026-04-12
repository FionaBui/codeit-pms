import { useEffect, useState } from 'react';
import { getResourceAllocationForNextMonths } from '../../api/resourceAllocationApi.js';
import { getAllocationRowsByMonth } from '../../helper/resourceAllocation.js';
function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}
export default function ResourcesAllocationsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getResourceAllocationForNextMonths(1).then(resourceAllocations => {
      const currentMonth = getCurrentMonth();
      const data = getAllocationRowsByMonth(resourceAllocations, currentMonth);
      setRows(data);
    });
  }, []);
  console.log('rows', rows);
  return (
    <>
      <h1>Resources Allocations </h1>
      {rows.map(row => (
        <div key={row.resourceName}>
          <strong>{row.resourceName}</strong> -{' '}
          {(row.totalPercent * 100).toFixed(0)}%
          <div>
            {row.allocations.map(allocation => (
              <div key={allocation.project}>
                {allocation.project} - {(allocation.percent * 100).toFixed(0)}%
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
