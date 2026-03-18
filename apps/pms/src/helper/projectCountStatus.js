const TYPE_4 = 'Type 4: Bug fixes and Daily tech support';
export function filterProjectTypes(projects) {
  return projects.filter((p) => p.projectType !== TYPE_4);
}

// Count type
export function getProjectCountByType(projects) {
  const visibleProjectType = filterProjectTypes(projects);
  const result = {};
  visibleProjectType.forEach((p) => {
    if (!p.projectType) return;
    result[p.projectType] = (result[p.projectType] ?? 0) + 1;
  });
  return Object.entries(result).map(([name, value]) => ({ name, value }));
}

// Total manhours by type
export function getTotalApprovalManhoursByType(projects) {
  const result = {};
  projects.forEach((p) => {
    result[p.projectType] =
      (result[p.projectType] ?? 0) + (p.plannedManhours ?? 0);
  });
  return Object.entries(result).map(([name, value]) => ({ name, value }));
}

function buildBasePieChart({ labelFormatter, chartData }) {
  return {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',

      left: 'center',
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        data: chartData,

        label: {
          show: true,
          position: 'outside',
          formatter: labelFormatter,
          fontSize: 12,
        },

        labelLine: {
          show: true,
          length: 10,
          length2: 8,
        },
      },
    ],
  };
}
export function buildProjectTypePieOption(projects) {
  const chartData = getProjectCountByType(projects);
  return buildBasePieChart({
    chartData,
    labelFormatter: '{b}: {c} ({d}%)',
  });
}

export function buildApprovalManhoursPieOption(projects) {
  const chartData = getTotalApprovalManhoursByType(projects);
  return buildBasePieChart({
    chartData,
    labelFormatter: '{b}: {c} h',
  });
}
