import { BaseChart, ChartCard } from '@codeit/ui';
import { pieChart } from '../../helper/pieChart.js';
import { getTotalApprovalManhoursByType } from '../../helper/projectCountStatus.js';

export function ApprovalManhoursPieChart({
  projects,

  selectedType,
  onTypeClick,
}) {
  const chartData = getTotalApprovalManhoursByType(projects);
  const option = pieChart({
    chartData,
    labelFormatter: '{b}: {c}h ({d}%)',
    selectedName: selectedType,
  });
  return (
    <ChartCard title="Approved Manhours by Type">
      <BaseChart
        option={option}
        onEvents={{
          click: (params) => onTypeClick?.(params.name),
        }}
      />
    </ChartCard>
  );
}
