export function pieChart({
  labelFormatter,
  chartData,
  selectedName,
  legendSelected,
}) {
  const hasSelection = Boolean(selectedName);

  const data = chartData.map((item) => {
    const isSelected = item.name === selectedName;

    return {
      ...item,
      itemStyle: {
        opacity: !hasSelection || isSelected ? 1 : 0.25,
      },
    };
  });

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'center',
      textStyle: {
        fontSize: 12,
      },
      selected: legendSelected ?? {},
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        selectedMode: false,
        data,
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
        emphasis: {
          scale: true,
          scaleSize: 6,
        },
      },
    ],
  };
}
