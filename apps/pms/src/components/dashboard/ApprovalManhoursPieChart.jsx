import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart.js';
import { getTotalApprovalManhoursByType } from '../../helper/projectCountStatus.js';

export function ApprovalManhoursPieChart({
  projects,

  selectedType,
  onTypeClick
}) {
  const chartData = getTotalApprovalManhoursByType(projects);
  const option = pieChart({
    chartData,
    labelFormatter: params => {
      const shortName = params.name.split(':')[0];
      return `${shortName}: ${params.value} h (${params.percent}%)`;
    },
    selectedName: selectedType
  });
  return (
    <ChartCard title="Approved Manhours by Type">
      <BaseChart
        option={option}
        onEvents={{
          click: params => onTypeClick?.(params.name)
        }}
      />
    </ChartCard>
  );
}
