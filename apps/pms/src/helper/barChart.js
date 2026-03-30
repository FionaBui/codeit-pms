export function barChart({ chartData, selectedType, visibleStatuses }) {
  const hasSelectedType = Boolean(selectedType);

  const filteredData = chartData.filter(item =>
    visibleStatuses.includes(item.name)
  );

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: params => {
        const dataIndex = params?.[0]?.dataIndex ?? 0;
        const item = filteredData[dataIndex];

        if (!item) return '';

        if (hasSelectedType) {
          return `
            ${item.name}<br/>
            Total Projects: ${item.total}<br/>
            Highlighted Projects: ${item.highlighted}
          `;
        }

        return `
          ${item.name}<br/>
          Total Projects: ${item.total}
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: filteredData.map(d => d.name)
    },

    yAxis: {
      type: 'value',
      minInterval: 1
    },

    grid: {
      top: 30,
      bottom: 20,
      containLabel: true
    },

    series: [
      {
        name: 'Highlighted',
        type: 'bar',
        stack: 'total',
        data: filteredData.map(d => d.highlighted),
        itemStyle: {
          color: '#5070dd'
        }
      },
      {
        name: 'Total',
        type: 'bar',
        stack: 'total',
        data: filteredData.map(d => d.rest),
        itemStyle: {
          opacity: selectedType ? 0.25 : 0.9
        }
      }
    ]
  };
}
