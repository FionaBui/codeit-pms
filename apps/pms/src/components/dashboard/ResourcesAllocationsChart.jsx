import { useState } from 'react';
import { BaseChart, ChartCard, CHART_COLORS } from '@codeit/ui';

export default function ResourcesAllocationsChart({ rows = [], currentMonth }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const resourceNames = rows.map(row => row.resourceName);
  const projectNames = [
    ...new Set(rows.flatMap(row => row.allocations.map(a => a.project)))
  ];

  const date = new Date(currentMonth);
  const monthLabel = `Summa ${date.toLocaleString('en-US', { month: 'short' })} ${String(date.getFullYear()).slice(-2)}`;

  const series = projectNames.map((projectName, index) => ({
    name: projectName,
    type: 'bar',
    stack: 'total',
    barCategoryGap: '30%',
    data: rows.map(row => {
      const found = row.allocations.find(a => a.project === projectName);
      const value = found ? found.percent : 0;

      const isSelected = selectedProject === projectName;
      const isNoSelection = selectedProject === null;

      return {
        value,
        itemStyle: {
          color: CHART_COLORS[index % CHART_COLORS.length],
          opacity: isNoSelection ? 1 : isSelected ? 1 : 0.15
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
        const value = params.value;
        return `
          <div style="min-width: 260px">
            <div style="margin-bottom: 8px; font-weight: 600;">${resourceName}</div>
            <div style="margin-bottom: 8px;">Project&nbsp;&nbsp;&nbsp; ${projectName}</div>
            <div>Summa Jan 26&nbsp;&nbsp;&nbsp; ${value.toFixed(2) * 100}%</div>
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
      nameLocation: 'middle',
      nameGap: 95,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: monthLabel,
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
    series
  };

  return (
    <ChartCard title="Resource allocation next month" height="40vh">
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
            Projects
          </h3>
          {projectNames.map((projectName, index) => {
            const isActive = selectedProject === projectName;

            return (
              <div
                key={projectName}
                onClick={() =>
                  setSelectedProject(prev =>
                    prev === projectName ? null : projectName
                  )
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#f5f5f5' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  opacity: selectedProject === null ? 1 : isActive ? 1 : 0.5
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
