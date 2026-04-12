function getPercentForMonth(allocation = [], selectedMonth) {
  const found = allocation.find(item => item.month.startsWith(selectedMonth));

  return found ? found.percent : 0;
}

export function getAllocationRowsByMonth(resourceAllocations, selectedMonth) {
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
