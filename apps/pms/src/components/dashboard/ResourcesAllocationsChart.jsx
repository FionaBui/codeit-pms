import { BaseChart, ChartCard, CHART_COLORS } from '@codeit/ui';

export default function ResourcesAllocationsChart({ rows = [] }) {
  const resourceNames = rows.map(row => row.resourceName);
  const projectNames = [
    ...new Set(rows.flatMap(row => row.allocations.map(a => a.project)))
  ];
  console.log('name', resourceNames);
  console.log('project', projectNames);

  const series = projectNames.map((projectName, index) => ({
    name: projectName,
    type: 'bar',
    stack: 'total',
    itemStyle: {
      color: CHART_COLORS[index % CHART_COLORS.length]
    },
    data: rows.map(row => {
      const found = row.allocations.find(a => a.project === projectName);
      return found ? found.percent : 0;
    })
  }));
  console.log('series', series);

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: params => {
        const resourceName = params.name;
        const projectName = params.seriesName;
        const value = params.value;

        return `
        <div style="min-width: 260px">
          <div style="margin-bottom: 8px; font-weight: 600;">Resource Name&nbsp;&nbsp;&nbsp; ${resourceName}</div>
          <div style="margin-bottom: 8px;">Project&nbsp;&nbsp;&nbsp; ${projectName}</div>
          <div>Summa Jan 26&nbsp;&nbsp;&nbsp; ${value.toFixed(2)}</div>
        </div>
      `;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 40,
      bottom: 20,
      textStyle: {
        fontSize: 11
      }
    },
    grid: {
      width: '65%',
      left: 30,
      right: 450,
      top: 70,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: resourceNames,
      nameLocation: 'middle',
      nameGap: 95,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Summa Jan 26',
      min: 0,
      max: 1.4,
      interval: 0.5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted'
        }
      }
    },
    series: series.map(item => ({
      ...item,
      barCategoryGap: '30%'
    }))
  };
  return (
    <ChartCard title="Resource allocation next month" height="45vh">
      <BaseChart option={option}></BaseChart>
    </ChartCard>
  );
}
