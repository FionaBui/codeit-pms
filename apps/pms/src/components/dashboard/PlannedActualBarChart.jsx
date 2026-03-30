import { BaseChart, ChartCard } from '@codeit/ui';
import { plannedActualBarChart } from '../../helper/plannedActualBarChart';
import { getPlannedVsActualManhoursByProject } from '../../helper/projectCountStatus';

export default function PlannedActualBarChart({ projects, selectedType }) {
  const chartData = getPlannedVsActualManhoursByProject(projects, selectedType);
  const option = plannedActualBarChart({ chartData, selectedType });
  return (
    <ChartCard title="Planned manhours vs Actual">
      <BaseChart option={option} style={{ width: '100%' }} />
    </ChartCard>
  );
}
