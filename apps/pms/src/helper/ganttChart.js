function getMonthPosition(date) {
  const d = new Date(date);
  const monthIndex = d.getMonth();
  const day = d.getDate();
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return monthIndex + (day - 1) / daysInMonth;
}
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export function ganttChart({ projects }) {
  if (!Array.isArray(projects)) return {};

  const chartData = projects.map(p => {
    const start = getMonthPosition(p.startDate);
    const end = getMonthPosition(p.endDate);
    const progressEnd = start + (end - start) * (p.completion || 0);

    return {
      name: p.name,
      shortName: p.shortName || p.name,
      start,
      end,
      progressEnd,
      startDate: p.startDate,
      endDate: p.endDate,
      completion: p.completion
    };
  });
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: params => {
        console.log('params', params);
        const dataIndex = params?.[0]?.dataIndex ?? 0;
        const item = chartData[dataIndex];
        if (!item) return '';
        return `
        <b>${item.name}</b> <br/>
        Start: ${formatDate(item.startDate)}<br/>
        End: ${formatDate(item.endDate)}<br/>
        Completion: ${item.completion * 100}%
        `;
      }
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 12,
      interval: 1,
      position: 'top',
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      },
      axisLabel: {
        formatter: value => months[value]
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: chartData.map(item => item.shortName),
      inverse: true,
      axisLine: {
        show: false
      }
    },
    grid: {
      left: 180,
      right: 40,
      top: 40,
      bottom: 60
    },
    series: [
      {
        name: 'offset',
        type: 'bar',
        stack: 'total',
        barWidth: 18,
        data: chartData.map(item => item.start),
        itemStyle: {
          color: 'transparent'
        }
      },
      {
        name: 'progress',
        type: 'bar',
        stack: 'total',
        barWidth: 18,
        data: chartData.map(item => item.progressEnd - item.start),
        itemStyle: {
          color: '#d97a00'
        }
      },
      {
        name: 'remaining',
        type: 'bar',
        stack: 'total',
        barWidth: 18,

        data: chartData.map(item => item.end - item.progressEnd),
        itemStyle: {
          color: '#e6bc84',
          borderRadius: [0, 9, 9, 0]
        }
      }
    ]
  };
}
