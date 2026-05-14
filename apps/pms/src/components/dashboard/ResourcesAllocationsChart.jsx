import { BaseChart, ChartCard, CHART_COLORS } from '@codeit/ui';
import { formatMonthLabel } from '../../helper/resourceAllocation.js';

export default function ResourcesAllocationsChart({
  rows = [],
  currentMonth,
  selectedProject,
  onSelectProject,
  selectedResource
}) {
  const resourceNames = rows.map(row => row.resourceName);

  const projectNames = [
    ...new Set(rows.flatMap(row => row.allocations.map(item => item.project)))
  ];

  const monthLabel = formatMonthLabel(currentMonth);

  const series = projectNames.map((projectName, index) => ({
    name: projectName,
    type: 'bar',
    stack: 'total',
    barCategoryGap: '30%',
    data: rows.map(row => {
      const found = row.allocations.find(item => item.project === projectName);
      const value = found ? found.percent : 0;

      const isProjectSelected = selectedProject === projectName;
      const isNoProjectSelected = selectedProject === null;

      const isResourceSelected = selectedResource === row.resourceName;
      const isNoResourceSelected = selectedResource === null;

      const projectOpacity = isNoProjectSelected
        ? 1
        : isProjectSelected
          ? 1
          : 0.15;

      const resourceOpacity = isNoResourceSelected
        ? 1
        : isResourceSelected
          ? 1
          : 0.15;

      return {
        value,
        itemStyle: {
          color: CHART_COLORS[index % CHART_COLORS.length],
          opacity: projectOpacity * resourceOpacity
        }
      };
    })
  }));

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
        const value = params.value || 0;

        return `
          <div style="min-width: 240px">
            <div style="margin-bottom: 8px; font-weight: 600;">${resourceName}</div>
            <div style="margin-bottom: 6px;">Project: ${projectName}</div>
            <div>${monthLabel}: ${(value * 100).toFixed(0)}%</div>
          </div>
        `;
      }
    },
    legend: {
      show: false
    },
    grid: {
      width: '95%',
      left: 30,
      top: 70,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: resourceNames,
      name: 'Resource Name',
      nameLocation: 'middle',
      nameGap: 95,
      axisLabel: {
        rotate: 35,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: monthLabel,
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
    series
  };

  return (
    <ChartCard
      title="Resources allocation per projects of next 01 month"
      height="40vh"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 30%',
          gap: '10px',
          height: '100%',
          padding: '10px 0'
        }}
      >
        <BaseChart option={option} />

        <div
          style={{
            overflowY: 'auto',
            padding: '10px 0'
          }}
        >
          <h3
            style={{
              fontWeight: 600,
              padding: '10px 0'
            }}
          >
            Project
          </h3>

          {projectNames.map((projectName, index) => {
            const isActive = selectedProject === projectName;

            return (
              <div
                key={projectName}
                onClick={() => onSelectProject(projectName)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#f5f5f5' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  opacity: selectedProject === null ? 1 : isActive ? 1 : 0.5,
                  padding: '4px 0'
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                  }}
                />
                <span>{projectName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
}
