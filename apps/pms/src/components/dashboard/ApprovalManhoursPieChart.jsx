import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart.js';
import { getTotalApprovalManhoursByType } from '../../helper/projectCountStatus.js';

export function ApprovalManhoursPieChart({
  projects,
  selectedType,
  selectedStatus,
  onTypeClick
}) {
  const chartData = getTotalApprovalManhoursByType(projects);

  const overlayChartData = selectedStatus
    ? getTotalApprovalManhoursByType(projects, selectedStatus)
    : null;

  const option = pieChart({
    chartData,
    overlayChartData,
    selectedStatus,
    labelFormatter: params => {
      const shortName = params.name.split(':')[0];
      return `${shortName}: ${params.value} h (${params.percent}%)`;
    },
    selectedType
  });
  return (
    <ChartCard title="Approved Manhours by Type" height="35vh">
      <BaseChart
        key={`approval-manhours-${selectedStatus || 'none'}-${selectedType || 'none'}`}
        option={option}
        onEvents={{
          click: params => onTypeClick?.(params.name)
        }}
      />
    </ChartCard>
  );
}
