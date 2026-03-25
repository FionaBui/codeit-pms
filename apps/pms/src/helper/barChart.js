export function barChart({ chartData, selectedType }) {
  const hasSelectedType = Boolean(selectedType);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: (params) => {
        const dataIndex = params?.[0]?.dataIndex ?? 0;
        const item = chartData[dataIndex];

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
      },
    },
    xAxis: {
      type: 'category',
      data: chartData.map((d) => d.name),
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    series: [
      {
        name: 'Highlighted',
        type: 'bar',
        stack: 'total',
        data: chartData.map((d) => d.highlighted),
        itemStyle: {
          color: '#5070dd',
        },
      },
      {
        name: 'Total',
        type: 'bar',
        stack: 'total',
        data: chartData.map((d) => d.rest),
        itemStyle: {
          opacity: selectedType ? 0.25 : 0.9,
        },
      },
    ],
  };
}
