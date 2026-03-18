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

export function buildProjectTypePieOption(projects) {
  const chartData = getProjectCountByType(projects);
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      orient: 'vertical',

      left: 'center',
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Project type',
        type: 'pie',
        radius: '65%',
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        data: chartData,

        label: {
          show: true,
          position: 'outside',
          formatter: '{c} ({d}%)',
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
