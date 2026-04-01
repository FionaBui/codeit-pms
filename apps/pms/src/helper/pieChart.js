export function pieChart({
  labelFormatter,
  chartData,
  selectedType,
  legendSelected,
  overlayChartData,
  selectedStatus
}) {
  const hasTypeSelection = Boolean(selectedType);
  const hasSelectedStatus = Boolean(selectedStatus);

  const baseData = chartData.map(item => {
    const isSelectedType = item.name === selectedType;

    return {
      ...item,
      itemStyle: {
        opacity: hasSelectedStatus
          ? 0.25
          : !hasTypeSelection || isSelectedType
            ? 1
            : 0.25
      }
    };
  });

  const overlayData = (overlayChartData ?? []).filter(item => item.value > 0);

  const series = [
    {
      type: 'pie',
      radius: '40%',
      center: ['50%', '40%'],
      selectedMode: false,
      data: baseData,
      label: {
        show: !hasSelectedStatus,
        position: 'outside',
        formatter: labelFormatter,
        fontSize: 12,
        width: 120,
        overflow: 'break',
        distanceToLabelLine: 5
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 15
      },
      emphasis: {
        scale: true,
        scaleSize: 6
      }
    }
  ];

  if (hasSelectedStatus) {
    series.push({
      type: 'pie',
      radius: '40%',
      center: ['50%', '40%'],
      selectedMode: false,
      z: 100,
      data: overlayData,
      label: {
        show: true,
        position: 'outside',
        formatter: labelFormatter
      },
      labelLine: {
        show: true
      },
      emphasis: {
        scale: true,
        scaleSize: 6
      }
    });
  }

  return {
    tooltip: {
      trigger: 'item',
      renderMode: 'html',
      formatter: params => {
        return `
      <div style="
        max-width: 220px;
        white-space: normal;
        overflow-wrap: anywhere;
       
      ">
        <div style="
          overflow-wrap: anywhere;
        ">
          ${params.name}
        </div>
        <div>
          Value: <b>${params.value}</b>
        </div>
        <div>
          Percentage: <b>${params.percent}%</b>
        </div>
      </div>
    `;
      }
    },
    legend: {
      orient: 'vertical',
      left: 'center',
      textStyle: {
        fontSize: 12
      },
      selected: legendSelected ?? {},
      inactiveColor: '#B1B2B5',
      formatter: name => {
        const isVisible = (legendSelected ?? {})[name] !== false;
        return isVisible ? name : `${name} (click to show)`;
      }
    },
    series
  };
}
