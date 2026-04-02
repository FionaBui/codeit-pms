import { BaseChart, ChartCard } from '@codeit/ui';
import { ganttChart } from '../../helper/ganttChart';
export default function ProjectsGanttChart({ projects }) {
  const option = ganttChart({ projects });
  return (
    <ChartCard title="Timeline view" height="85vh">
      <BaseChart option={option} />
    </ChartCard>
  );
}
