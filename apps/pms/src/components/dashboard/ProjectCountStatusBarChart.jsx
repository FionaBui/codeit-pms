import { BaseChart, ChartCard } from '@codeit/ui';
import { Space } from 'antd';
import { barChart } from '../../helper/barChart';
import { getProjectCountByStatus } from '../../helper/projectCountStatus';

const ALL_STATUSES = ['plan', 'execution', 'closing', 'finished'];
const LEGEND_COLOR = '#5070dd';

export function ProjectCountStatusBarChart({
  projects,
  selectedType,
  selectedStatus,
  visibleStatuses,
  onStatusLegendClick,
  onStatusClick
}) {
  const chartData = getProjectCountByStatus(
    projects,
    selectedType,
    selectedStatus
  );

  const option = barChart({
    chartData,
    selectedType,
    visibleStatuses,
    selectedStatus
  });

  return (
    <ChartCard title="Projects Count by Status" height="50vh">
      <BaseChart
        option={option}
        height={'46vh'}
        onEvents={{
          click: params => {
            if (params.componentType === 'series') {
              onStatusClick?.(params.name);
            }
          }
        }}
      />

      <Space wrap size={16} style={{ justifyContent: 'center', width: '100%' }}>
        {ALL_STATUSES.map(status => {
          const isActive = visibleStatuses.includes(status);

          return (
            <div
              key={status}
              onClick={() => onStatusLegendClick(status)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.35,
                userSelect: 'none'
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: LEGEND_COLOR,
                  display: 'inline-block'
                }}
              />
              <span style={{ fontSize: 12 }}>
                {!isActive ? `${status} (click to show)` : status}
              </span>
            </div>
          );
        })}
      </Space>
    </ChartCard>
  );
}
