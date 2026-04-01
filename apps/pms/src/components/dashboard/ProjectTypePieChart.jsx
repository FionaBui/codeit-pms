import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart';
import { getProjectCountByType } from '../../helper/projectCountStatus';

export function ProjectTypePieChart({
  projects,
  selectedType,
  selectedStatus,
  onTypeClick,
  legendSelected,
  onLegendChange
}) {
  const chartData = getProjectCountByType(projects);

  const overlayChartData = selectedStatus
    ? getProjectCountByType(projects, selectedStatus)
    : null;

  const option = pieChart({
    chartData,
    overlayChartData,
    selectedStatus,
    labelFormatter: params => {
      const shortName = params.name.split(':')[0];
      return `${shortName}: ${params.value} (${params.percent}%)`;
    },
    selectedType,
    legendSelected
  });

  return (
    <ChartCard title="Projects by Type" height="35vh">
      <BaseChart
        key={`project-type-${selectedStatus || 'none'}-${selectedType || 'none'}`}
        option={option}
        onEvents={{
          click: params => onTypeClick?.(params.name),
          legendselectchanged: params => {
            onLegendChange?.(params.selected);
          }
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}
