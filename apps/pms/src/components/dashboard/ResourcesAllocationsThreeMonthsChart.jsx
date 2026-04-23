import { BaseChart, ChartCard } from '@codeit/ui';
import { formatMonthLabel } from '../../helper/resourceAllocation.js';

const MONTH_COLORS = ['#7db7ff', '#1f3fbf', '#f08a5d'];

export default function ResourcesAllocationsThreeMonthsChart({
  rows = [],
  months = [],
  selectedProject,
  selectedResource,
  onSelectResource
}) {
  const resourceNames = rows.map(row => row.resourceName);

  const plainTotalSeries = months.map((month, index) => ({
    name: formatMonthLabel(month),
    type: 'bar',
    barWidth: 12,
    barCategoryGap: '20%',
    data: rows.map(row => {
      const value = row.totals?.[month] || 0;

      const isResourceSelected = selectedResource === row.resourceName;
      const isNoResourceSelected = selectedResource === null;

      return {
        value,
        itemStyle: {
          color: MONTH_COLORS[index],
          opacity: isNoResourceSelected ? 1 : isResourceSelected ? 1 : 0.18
        }
      };
    })
  }));

  const remainingSeries = selectedProject
    ? months.map((month, index) => ({
        name: `${formatMonthLabel(month)} remaining`,
        type: 'bar',
        stack: `month-${index}`,
        barWidth: 12,
        barCategoryGap: '20%',
        data: rows.map(row => {
          const totalValue = row.totals?.[month] || 0;
          const selectedValue = row.projects?.[selectedProject]?.[month] || 0;
          const remainingValue = Math.max(totalValue - selectedValue, 0);

          const resourceHasSelectedProject = months.some(
            itemMonth => (row.projects?.[selectedProject]?.[itemMonth] || 0) > 0
          );

          return {
            value: remainingValue,
            itemStyle: {
              color: MONTH_COLORS[index],
              opacity: resourceHasSelectedProject ? 0.18 : 0.08
            }
          };
        })
      }))
    : [];

  const selectedSeries = selectedProject
    ? months.map((month, index) => ({
        name: `${formatMonthLabel(month)} selected`,
        type: 'bar',
        stack: `month-${index}`,
        barWidth: 12,
        barCategoryGap: '20%',
        z: 3,
        data: rows.map(row => {
          const value = row.projects?.[selectedProject]?.[month] || 0;

          const resourceHasSelectedProject = months.some(
            itemMonth => (row.projects?.[selectedProject]?.[itemMonth] || 0) > 0
          );

          return {
            value,
            itemStyle: {
              color: MONTH_COLORS[index],
              opacity: resourceHasSelectedProject ? 1 : 0.08
            }
          };
        })
      }))
    : [];

  const option = {
    color: MONTH_COLORS,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: params => {
        if (!params.length) {
          return '';
        }

        const resourceName = params[0].name;
        const row = rows.find(item => item.resourceName === resourceName);

        const monthLines = months
          .map((month, index) => {
            const total = row?.totals?.[month] || 0;
            const selected = selectedProject
              ? row?.projects?.[selectedProject]?.[month] || 0
              : 0;
            const remaining = Math.max(total - selected, 0);

            const label = formatMonthLabel(month);
            const marker = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${MONTH_COLORS[index]};margin-right:6px;"></span>`;

            if (selectedProject) {
              return `${marker}${label}: total ${(total * 100).toFixed(0)}% | selected ${(selected * 100).toFixed(0)}% | other ${(remaining * 100).toFixed(0)}%`;
            }

            return `${marker}${label}: ${(total * 100).toFixed(0)}%`;
          })
          .join('<br/>');

        return `
          <div style="min-width: 240px">
            <div style="margin-bottom: 8px; font-weight: 600;">${resourceName}</div>
            ${monthLines}
          </div>
        `;
      }
    },
    legend: {
      bottom: 0,
      data: months.map(month => formatMonthLabel(month))
    },
    grid: {
      left: 40,
      right: 30,
      top: 30,
      bottom: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: resourceNames,
      axisLabel: {
        interval: 0,
        rotate: 35
      }
    },
    yAxis: {
      type: 'value',
      interval: 0.5,
      axisLabel: {
        formatter: value => `${value * 100}%`
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted'
        }
      }
    },
    series: selectedProject
      ? [...selectedSeries, ...remainingSeries]
      : plainTotalSeries
  };

  const handleChartClick = params => {
    if (!params?.name) {
      return;
    }

    onSelectResource(params.name);
  };

  return (
    <ChartCard title="Resources allocation next 03 months" height="40vh">
      <BaseChart option={option} onEvents={{ click: handleChartClick }} />
    </ChartCard>
  );
}
