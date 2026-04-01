export function barChart({
  chartData,
  selectedType,
  visibleStatuses,
  selectedStatus
}) {
  const hasSelectedType = Boolean(selectedType);
  const hasSelectedStatus = Boolean(selectedStatus);

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
      top: 40,
      bottom: 20,
      containLabel: true
    },

    series: [
      {
        name: 'Highlighted',
        type: 'bar',
        stack: 'total',
        data: filteredData.map(item => ({
          value: item.highlighted,
          itemStyle: {
            color: '#5070dd',
            opacity: hasSelectedStatus
              ? item.name === selectedStatus
                ? 1
                : 0.25
              : 1
          }
        }))
      },
      {
        name: 'Total',
        type: 'bar',
        stack: 'total',
        data: filteredData.map(item => ({
          value: item.rest,
          itemStyle: {
            color: '#5070dd',
            opacity: hasSelectedStatus
              ? item.name === selectedStatus
                ? 0.9
                : 0.15
              : hasSelectedType
                ? 0.25
                : 0.9
          }
        }))
      }
    ]
  };
}
