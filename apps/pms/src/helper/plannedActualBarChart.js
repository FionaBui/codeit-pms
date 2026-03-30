export function plannedActualBarChart({ chartData, selectedType }) {
  const hasSelectedType = Boolean(selectedType);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: params => {
        const planned = params.find(p => p.seriesName === 'Planned manhours');
        const actual = params.find(p => p.seriesName === 'Actual manhours');
        const fullName =
          planned?.data?.fullName || actual?.data?.fullName || '';
        const plannedValue = planned?.value ?? 0;
        const actualValue = actual?.value ?? 0;

        return `
          ${fullName}<br/>
          Planned: ${plannedValue} h<br/>
          Actual: ${actualValue} h<br/>
          Variance: ${actualValue - plannedValue} h
        `;
      }
    },
    legend: {
      bottom: '0%',
      data: ['Planned manhours', 'Actual manhours']
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      name: 'Hours'
    },
    yAxis: {
      type: 'category',
      data: chartData.map(item => item.shortName),
      axisLabel: {
        width: 140,
        overflow: 'break',
        lineHeight: 14
      }
    },
    grid: {
      left: 10,
      right: 60,
      top: 20,
      bottom: 35,
      containLabel: true
    },
    series: [
      {
        name: 'Planned manhours',
        type: 'bar',
        itemStyle: {
          color: '#6ca2df'
        },
        data: chartData.map(item => ({
          value: item.planned,
          fullName: item.name,
          itemStyle: {
            opacity: hasSelectedType && !item.isHighlighted ? 0.25 : 1
          }
        }))
      },

      {
        name: 'Actual manhours',
        type: 'bar',
        itemStyle: {
          color: '#1d39c4'
        },
        data: chartData.map(item => ({
          value: item.actual,
          fullName: item.name,
          itemStyle: {
            opacity: hasSelectedType && !item.isHighlighted ? 0.25 : 1,
            borderColor: item.isOverrun ? '#F63A1D' : undefined,
            borderWidth: item.isOverrun ? 1 : 0
          }
        }))
      }
    ]
  };
}
