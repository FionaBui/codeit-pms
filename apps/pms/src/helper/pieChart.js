export function pieChart({
  labelFormatter,
  chartData,
  selectedName,
  legendSelected
}) {
  const hasSelection = Boolean(selectedName);

  const data = chartData.map(item => {
    const isSelected = item.name === selectedName;

    return {
      ...item,
      itemStyle: {
        opacity: !hasSelection || isSelected ? 1 : 0.25
      }
    };
  });

  return {
    tooltip: {
      trigger: 'item',
      renderMode: 'html',
      formatter: params => {
        return `
      <div style="
        max-width: 220px;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: anywhere;
        line-height: 1.4;
      ">
        <div style="
          font-weight: 500;
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
      inactiveColor: 'rgba(242, 101, 34, 0.45)',
      formatter: name => {
        const isVisible = (legendSelected ?? {})[name] !== false;
        return isVisible ? name : `${name} (click to show)`;
      }
    },
    series: [
      {
        type: 'pie',
        radius: '40%',
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        selectedMode: false,
        data,
        label: {
          show: true,
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
    ]
  };
}
