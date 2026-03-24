import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart.jsx';
import { getProjectCountByType } from '../../helper/projectCountStatus';

export function ProjectTypePieChart({
  projects,
  selectedType,
  onTypeClick,
  legendSelected,
}) {
  const chartData = getProjectCountByType(projects);
  const option = pieChart({
    chartData,
    labelFormatter: '{b}: {c} ({d}%)',
    selectedName: selectedType,
    legendSelected,
  });
  return (
    <ChartCard title="Projects by Type">
      <BaseChart
        option={option}
        onEvents={{ click: (params) => onTypeClick?.(params.name) }}
      />
    </ChartCard>
  );
}
