export function getPercentForMonth(allocation = [], selectedMonth) {
  const found = allocation.find(item => item.month.startsWith(selectedMonth));

  return found ? found.percent : 0;
}

export function getMonthStart(offset = 0) {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-01`;
}

export function getNextThreeMonths() {
  return [getMonthStart(0), getMonthStart(1), getMonthStart(2)];
}

export function formatMonthLabel(monthString) {
  const date = new Date(monthString);

  return `Summa ${date.toLocaleString('en-US', { month: 'short' })} ${String(
    date.getFullYear()
  ).slice(-2)}`;
}

export function getAllocationRowsForMonths(resourceAllocations, months) {
  if (!Array.isArray(resourceAllocations)) {
    return [];
  }

  const groupedByResource = {};

  resourceAllocations.forEach(doc => {
    if (!groupedByResource[doc.resource]) {
      groupedByResource[doc.resource] = {
        resourceName: doc.resource,
        totals: {},
        projects: {}
      };

      months.forEach(month => {
        groupedByResource[doc.resource].totals[month] = 0;
      });
    }

    months.forEach(month => {
      const percent = getPercentForMonth(doc.allocation, month);

      if (percent <= 0) {
        return;
      }

      groupedByResource[doc.resource].totals[month] += percent;

      if (!groupedByResource[doc.resource].projects[doc.project]) {
        groupedByResource[doc.resource].projects[doc.project] = {};
      }

      groupedByResource[doc.resource].projects[doc.project][month] = percent;
    });
  });

  return Object.values(groupedByResource);
}

export function getCurrentMonthRows(rows, currentMonth) {
  return rows
    .map(row => {
      const allocations = Object.entries(row.projects)
        .map(([project, months]) => ({
          project,
          percent: months[currentMonth] || 0
        }))
        .filter(item => item.percent > 0);

      return {
        resourceName: row.resourceName,
        totalPercent: row.totals[currentMonth] || 0,
        allocations
      };
    })
    .filter(row => row.totalPercent > 0);
}
