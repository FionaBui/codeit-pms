import { BaseChart, ChartCard } from '@codeit/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

const LEGEND_COLOR = '#5070dd';

export function ProjectCountStatusBarChart({
  projects,
  selectedType,
  onStatusClick,
  selectedStatus: inputSelectedStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState();

  useEffect(() => {
    if (inputSelectedStatus !== selectedStatus)
      setSelectedStatus(inputSelectedStatus);
  }, [inputSelectedStatus]);

  const option = useMemo(() => {
    const data = Object.values(
      projects.reduce((acc, project) => {
        if (!project.status) return acc;

        const item = acc[project.status] ?? {
          name: project.status,
          highlighted: 0,
          rest: 0,
          total: 0
        };

        item.total += 1;
        if (!selectedType || project.type === selectedType) {
          item.highlighted += 1;
        } else {
          item.rest += 1;
        }

        acc[project.status] = item;
        return acc;
      }, {})
    );

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
        formatter: params => {
          const dataIndex = params?.[0]?.dataIndex ?? 0;
          const item = data[dataIndex];

          if (!item) return '';

          if (selectedType) {
            return `
              ${item.name}<br/>
              Total Projects: ${item.total}<br/>
              Highlighted Projects: ${item.highlighted}
            `;
          }

          return `
            ${item.name}<br/>
            Total Projects: ${item.total}
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        triggerEvent: true
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      grid: {
        top: 40,
        bottom: 20,
        containLabel: true
      },
      series: [
        {
          name: 'Highlighted',
          type: 'bar',
          stack: 'total',
          data: data.map(item => ({
            value: item.highlighted,
            itemStyle: {
              color: LEGEND_COLOR,
              opacity: selectedStatus
                ? item.name === selectedStatus
                  ? 1
                  : 0.25
                : 1
            }
          }))
        },
        {
          name: 'Total',
          type: 'bar',
          stack: 'total',
          data: data.map(item => ({
            value: item.rest,
            itemStyle: {
              color: LEGEND_COLOR,
              opacity: selectedStatus
                ? item.name === selectedStatus
                  ? 0.9
                  : 0.15
                : selectedType
                  ? 0.25
                  : 0.9
            }
          }))
        }
      ]
    };
  }, [projects, selectedType, selectedStatus]);

  const handleStatusClick = useCallback(
    status => {
      onStatusClick?.(status);
      setSelectedStatus(selectedStatus === status ? null : status);
    },
    [selectedStatus, onStatusClick]
  );

  return (
    <ChartCard title="Projects Count by Status" height="50vh">
      <BaseChart
        option={option}
        height={'46vh'}
        onEvents={{
          click: params => {
            if (
              params.componentType === 'series' ||
              params.componentType === 'xAxis'
            ) {
              handleStatusClick(params.name ?? params.value);
            }
          }
        }}
      />
    </ChartCard>
  );
}
