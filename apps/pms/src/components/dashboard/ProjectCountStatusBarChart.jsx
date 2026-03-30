import { BaseChart, ChartCard } from '@codeit/ui';
import { Space } from 'antd';
import { barChart } from '../../helper/barChart';
import { getProjectCountByStatus } from '../../helper/projectCountStatus';

const ALL_STATUSES = ['plan', 'execution', 'closing', 'finished'];
const LEGEND_COLOR = '#5070dd';

export function ProjectCountStatusBarChart({
  projects,
  selectedType,
  visibleStatuses,
  onStatusLegendClick
}) {
  const chartData = getProjectCountByStatus(projects, selectedType);

  const option = barChart({
    chartData,
    selectedType,
    visibleStatuses
  });

  return (
    <ChartCard title="Projects Count by Status">
      <BaseChart option={option} />
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
              <span style={{ fontSize: 11 }}>{status}</span>
            </div>
          );
        })}
      </Space>
    </ChartCard>
  );
}
