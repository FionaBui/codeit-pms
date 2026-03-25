export function plannedActualBarChart({ chartData, selectedType }) {
  const hasSelectedType = Boolean(selectedType);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const planned = params.find((p) => p.seriesName === 'Planned manhours');
        const actual = params.find((p) => p.seriesName === 'Actual manhours');

        const name = planned?.axisValue || actual?.axisValue || '';
        const plannedValue = planned?.value ?? 0;
        const actualValue = actual?.value ?? 0;

        return `
          ${name}<br/>
          Planned: ${plannedValue} h<br/>
          Actual: ${actualValue} h<br/>
          Variance: ${actualValue - plannedValue} h
        `;
      },
    },

    legend: {
      top: 0,
      data: ['Planned manhours', 'Actual manhours'],
    },

    xAxis: {
      type: 'category',
      data: chartData.map((item) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 35,
      },
    },

    yAxis: {
      type: 'value',
      minInterval: 1,
      name: 'Hours',
    },

    series: [
      {
        name: 'Planned manhours',
        type: 'bar',
        barWidth: 8,
        itemStyle: {
          color: '#6ca2df',
        },
        data: chartData.map((item) => ({
          value: item.planned,
          itemStyle: {
            opacity: hasSelectedType && !item.isHighlighted ? 0.25 : 1,
          },
        })),
      },
      {
        name: 'Actual manhours',
        type: 'bar',
        barWidth: 8,
        itemStyle: {
          color: '#1d39c4',
        },
        data: chartData.map((item) => ({
          value: item.actual,
          itemStyle: {
            opacity: hasSelectedType && !item.isHighlighted ? 0.25 : 1,
            borderColor: item.isOverrun ? '#F63A1D' : undefined,
            borderWidth: item.isOverrun ? 2 : 0,
          },
        })),
      },
    ],
  };
}
