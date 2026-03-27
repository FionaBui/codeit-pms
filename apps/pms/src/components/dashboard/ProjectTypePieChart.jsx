import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart';
import { getProjectCountByType } from '../../helper/projectCountStatus';

export function ProjectTypePieChart({
  projects,
  selectedType,
  onTypeClick,
  legendSelected
}) {
  const chartData = getProjectCountByType(projects);
  const option = pieChart({
    chartData,
    labelFormatter: params => {
      const shortName = params.name.split(':')[0];
      return `${shortName}: ${params.value} (${params.percent}%)`;
    },
    selectedName: selectedType,
    legendSelected
  });
  return (
    <ChartCard title="Projects by Type">
      <BaseChart
        option={option}
        onEvents={{ click: params => onTypeClick?.(params.name) }}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
}
