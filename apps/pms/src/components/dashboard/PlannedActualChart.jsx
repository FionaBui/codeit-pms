import { BaseChart, ChartCard } from '@codeit/ui';
import { plannedActualBarChart } from '../../helper/plannedActualBarChart';
import { getPlannedVsActualManhoursByProject } from '../../helper/projectCountStatus';

export default function PlannedActualChart({
  projects,
  selectedType,
  selectedStatus
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
    <ChartCard title="Planned manhours vs Actual manhours" height="400px">
      <BaseChart option={option} />
    </ChartCard>
  );
}
