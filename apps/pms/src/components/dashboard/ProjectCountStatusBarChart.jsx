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
      projects.reduce((acc, { status, type }) => {
        if (!status) return acc;

        const item = acc[status] ?? {
          name: status,
          highlighted: 0,
          rest: 0,
          total: 0
        };

        item.total += 1;
        if (!selectedType || type === selectedType) {
          item.highlighted += 1;
        } else {
          item.rest += 1;
        }

        acc[status] = item;
        return acc;
      }, {})
    );

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
        textStyle: { fontSize: 12 },
        formatter: params => {
          const dataIndex = params?.[0]?.dataIndex ?? 0;
          const { name, total, highlighted } = data[dataIndex];

          if (!name) return '';

          if (selectedType)
            return `
              <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 12px;">
                <span style="color: #4b6979; font-weight: 600; text-align: right">Status</span>
                <span style="text-transform: capitalize">${name}</span>
                <span style="color: #4b6979; font-weight: 600; text-align: right">Count of projects</span>
                <span>${total}</span>
                ${
                  highlighted && highlighted !== total
                    ? `<span style="color: #4b6979; font-weight: 600; text-align: right">Highlighted</span>
                <span>${highlighted}</span>`
                    : ''
                }
              </div>
            `;

          return `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 12px;">
           <span style="color: #4b6979; font-weight: 600; text-align: right">Status</span>
           <span style="text-transform: capitalize">${name}</span>
           <span style="color: #4b6979; font-weight: 600; text-align: right">Count of projects</span>
           <span>${total}</span>
          </div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        triggerEvent: true,
        axisLabel: {
          formatter: value => {
            return value.charAt(0).toUpperCase() + value.slice(1);
          }
        }
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
              opacity:
                !selectedStatus || item.name === selectedStatus ? 1 : 0.25
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
              opacity: 0.25
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
    <ChartCard title="Projects Count by Status" height="400px">
      <BaseChart
        option={option}
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
