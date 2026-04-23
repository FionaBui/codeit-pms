import { BaseChart, ChartCard } from '@codeit/ui';
import { plannedActualBarChart } from '../../helper/plannedActualBarChart';
import { getPlannedVsActualManhoursByProject } from '../../helper/projectCountStatus';

export default function PlannedActualChart({
  projects,
  selectedType,
  selectedStatus,
  className
}) {
  const chartData = getPlannedVsActualManhoursByProject(
    projects,
    selectedType,
    selectedStatus
  );

  const option = plannedActualBarChart({
    chartData,
    selectedType,
    selectedStatus
  });

  return (
    <ChartCard
      title="Planned manhours vs Actual manhours"
      className={className}
      classNames={{ body: 'flex-1' }}
      height="100%"
    >
      <BaseChart option={option} />
    </ChartCard>
  );
}
