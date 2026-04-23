import { BaseChart, ChartCard } from '@codeit/ui';
import { useMemo, useState, useCallback, useEffect } from 'react';

const PIE_COLORS = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc'
];

export const ProjectByTypeChart = ({
  title = 'Projects by Type',
  projects = [],
  onTypeClick,
  calcKey,
  labelFormatter,
  selectedType: inputSelectedType,
  selectedStatus,
  className
}) => {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (inputSelectedType !== selectedType) setSelectedType(inputSelectedType);
  }, [inputSelectedType, selectedType]);

  const option = useMemo(() => {
    const counts = projects.reduce((acc, { type, status, [calcKey]: v }) => {
      if (!type) return acc;

      const value = v || 1;
      const item = acc[type] ?? { total: 0, filtered: 0 };

      item.total += value;
      if (status === selectedStatus) item.filtered += value;

      acc[type] = item;

      return acc;
    }, {});
    const totalValue = Object.values(counts).reduce(
      (acc, { total }) => acc + total,
      0
    );
    const data = Object.entries(counts).map(
      ([type, { total, filtered }], index) => ({
        name: type,
        value: total,
        filtered,
        totalValue,
        itemStyle: {
          color: PIE_COLORS[index % PIE_COLORS.length],
          opacity:
            !selectedStatus && (!selectedType || selectedType === type)
              ? 1
              : 0.25
        }
      })
    );
    const series = [
      {
        type: 'pie',
        radius: '70%',
        center: [200, '50%'],
        selectedMode: false,
        data,
        label: {
          position: 'outside',
          formatter: ({
            name,
            percent,
            value,
            data: { filtered, totalValue }
          }) => {
            const shortName = name.split(':')[0];

            if (selectedStatus) {
              value = filtered;
              percent = (filtered / totalValue) * 100;
            }

            return (
              labelFormatter?.({ name: shortName, percent, value }) ||
              `${value?.toLocaleString()} (${percent?.toFixed(2)}%)`
            );
          },
          fontSize: 12,
          width: 200,
          overflow: 'truncate',
          distanceToLabelLine: 5,
          opacity: 1
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        },
        emphasis: { scale: false, scaleSize: 6 }
      }
    ];

    if (selectedStatus && totalValue) {
      const overlayData = Object.entries(counts).reduce(
        (acc, [type, { total, filtered }], index) => {
          const angle = (total / totalValue) * Math.PI * 2;
          const startAngle = acc.at(-1)?.endAngle ?? -Math.PI / 2;
          const endAngle = startAngle + angle;

          acc.push({
            name: type,
            filtered,
            total,
            color: PIE_COLORS[index % PIE_COLORS.length],
            startAngle,
            endAngle,
            opacity: 1
          });

          return acc;
        },
        []
      );

      series.push({
        type: 'custom',
        coordinateSystem: 'none',
        silent: true,
        z: 10,
        data: overlayData,
        renderItem(params, api) {
          const item = overlayData[params.dataIndex];

          if (!item?.filtered) return null;

          const width = api.getWidth();
          const height = api.getHeight();
          const baseRadius = Math.min(width, height) * 0.5 * 0.5;
          const outerRadius = baseRadius * (item.filtered / item.total);

          return {
            type: 'sector',
            shape: {
              // cx: width * 0.25,
              cx: 200,
              cy: height * 0.5,
              r0: 0,
              r: outerRadius,
              startAngle: item.startAngle,
              endAngle: item.endAngle,
              clockwise: true
            },
            style: {
              fill: item.color,
              opacity: item.opacity
            }
          };
        }
      });
    }

    return {
      tooltip: {
        trigger: 'item',
        renderMode: 'html',
        textStyle: { fontSize: 12 },
        formatter: ({
          name,
          value,
          percent,
          data: { filtered, totalValue }
        }) => {
          return `
        <div style="max-width: 400px; white-space: normal; overflow-wrap: anywhere; display: grid; grid-template-columns: auto 1fr; column-gap: 12px;">
          <span style="color: #4b6979; font-weight: 600; text-align: right">Project Type</span>
          <span style="overflow-wrap: anywhere;">${name}</span>
          <span style="color: #4b6979; font-weight: 600; text-align: right">Count of projects</span>
          <span>${value?.toLocaleString()} (${percent?.toFixed(2)}%)</span>
          ${
            filtered && filtered !== value
              ? `<span style="color: #4b6979; font-weight: 600; text-align: right">Highlighted</span>
          <span>${filtered?.toLocaleString()} (${((filtered / totalValue) * 100)?.toFixed(2)}%)</span>`
              : ''
          }
        </div>
      `;
        }
      },
      legend: {
        orient: 'vertical',
        // left: 'center',
        top: 'center',
        left: 400,
        textStyle: {
          fontSize: 12,
          width: 280,
          overflow: 'truncate',
          ellipsis: '...'
        },
        tooltip: {
          show: true,
          confine: true,
          renderMode: 'html',
          textStyle: { fontSize: 12 },
          formatter: params => {
            const name = typeof params === 'string' ? params : params?.name;
            if (!name) return '';
            return `<div style="max-width: 400px; white-space: normal; overflow-wrap: anywhere;">${name}</div>`;
          }
        },
        inactiveColor: '#B1B2B5'
      },
      series
    };
  }, [calcKey, labelFormatter, projects, selectedStatus, selectedType]);

  const handleClick = useCallback(
    params => {
      const name = params.name;

      setSelectedType(prev => (prev === name ? null : name));
      onTypeClick?.(name);
    },
    [onTypeClick]
  );

  return (
    <ChartCard title={title} height="200px" className={className}>
      <BaseChart
        option={option}
        onEvents={{
          click: handleClick,
          legendselectchanged: handleClick
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
};
