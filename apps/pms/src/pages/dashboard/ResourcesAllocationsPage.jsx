import { useEffect, useState } from 'react';
import { getResourceAllocationForNextMonths } from '../../api/resourceAllocationApi.js';

import ResourcesAllocationsChart from '../../components/dashboard/ResourcesAllocationsChart.jsx';

function getPercentForMonth(allocation = [], selectedMonth) {
  const found = allocation.find(item => item.month.startsWith(selectedMonth));

  return found ? found.percent : 0;
}
function getAllocationRowsByMonth(resourceAllocations, selectedMonth) {
  if (!Array.isArray(resourceAllocations)) {
    return [];
  }

  const groupedByResource = {};

  resourceAllocations.forEach(doc => {
    const percent = getPercentForMonth(doc.allocation, selectedMonth);
    if (percent <= 0) return;

    if (!groupedByResource[doc.resource]) {
      groupedByResource[doc.resource] = {
        resourceName: doc.resource,
        totalPercent: 0,
        allocations: []
      };
    }
    groupedByResource[doc.resource].totalPercent += percent;
    groupedByResource[doc.resource].allocations.push({
      project: doc.project,
      percent
    });
  });
  return Object.values(groupedByResource);
}

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}
export default function ResourcesAllocationsPage() {
  const [nextMonthRows, setNextMonthRows] = useState([]);
  const currentMonth = getCurrentMonth();
  useEffect(() => {
    getResourceAllocationForNextMonths(1).then(resourceAllocations => {
      const nextMonthData = getAllocationRowsByMonth(
        resourceAllocations,
        currentMonth
      );
      setNextMonthRows(nextMonthData);
    });
  }, [currentMonth]);
  return (
    <ResourcesAllocationsChart
      rows={nextMonthRows}
      currentMonth={currentMonth}
    />
  );
}
