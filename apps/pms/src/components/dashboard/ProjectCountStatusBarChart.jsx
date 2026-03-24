import { BaseChart, ChartCard } from '@codeit/ui';
import { barChart } from '../../helper/barChart';
import { getProjectCountByStatus } from '../../helper/projectCountStatus';

export function ProjectCountStatusBarChart({
  projects,
  selectedType,
  onStatusClick,
}) {
  const chartData = getProjectCountByStatus(projects, selectedType);
  console.log('chartData:', chartData);
  const option = barChart({ chartData, selectedType });
  return (
    <ChartCard title="Projects Count by Status">
      <BaseChart
        option={option}
        onEvents={{
          click: (params) => {
            console.log('PIE CLICK PARAMS:', params);
            onTypeClick?.(params.name);
            console.log('PARAMS NAME', params.name);
          },
        }}
      />
    </ChartCard>
  );
}
