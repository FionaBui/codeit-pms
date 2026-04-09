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
  accKey,
  labelFormatter,
  selectedType: inputSelectedType,
  selectedStatus
}) => {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (inputSelectedType !== selectedType) setSelectedType(inputSelectedType);
  }, [inputSelectedType, selectedType]);

  const option = useMemo(() => {
    const counts = projects.reduce((acc, { type, status, [accKey]: v }) => {
      if (!type) return acc;

      const value = v || 1;
      const item = acc[type] ?? { total: 0, filtered: 0 };

      item.total += value;
      if (!selectedStatus || status === selectedStatus) {
        item.filtered += value;
      }

      acc[type] = item;

      return acc;
    }, {});

    const data = Object.entries(counts).map(([type, count], index) => ({
      name: type,
      value: count.total,
      itemStyle: {
        color: PIE_COLORS[index % PIE_COLORS.length],
        opacity:
          !selectedStatus && (!selectedType || selectedType === type) ? 1 : 0.25
      }
    }));

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const maxFilteredValue = Math.max(
      ...Object.values(counts).map(item => item.filtered),
      0
    );

    const overlayData = totalValue
      ? Object.entries(counts).reduce(
          (result, [type, count], index) => {
            const angle = (count.total / totalValue) * Math.PI * 2;
            const startAngle = result.currentAngle;
            const endAngle = startAngle + angle;

            result.items.push({
              name: type,
              filtered: count.filtered,
              total: count.total,
              color: PIE_COLORS[index % PIE_COLORS.length],
              startAngle,
              endAngle,
              opacity: 1
            });
            result.currentAngle = endAngle;

            return result;
          },
          { currentAngle: -Math.PI / 2, items: [] }
        ).items
      : [];

    const series = [
      {
        type: 'pie',
        radius: '50%',
        center: ['50%', '40%'],
        selectedMode: false,
        data,
        label: {
          position: 'outside',
          formatter:
            labelFormatter ||
            (params => {
              const shortName = params.name.split(':')[0];
              return `${shortName}: ${params.value?.toLocaleString()} (${params.percent}%)`;
            }),
          fontSize: 12,
          width: 120,
          overflow: 'break',
          distanceToLabelLine: 5,
          // opacity: selectedStatus ? 0.35 : 1,
          show: selectedStatus ? false : true
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 15
        },
        emphasis: { scale: false, scaleSize: 6 }
      }
    ];

    if (selectedStatus && maxFilteredValue > 0) {
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
          const outerRadius =
            baseRadius * (0.2 + (item.filtered / item.total) * 0.8);

          return {
            type: 'sector',
            shape: {
              cx: width * 0.5,
              cy: height * 0.4,
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
        formatter: params => `
        <div style="max-width: 220px; white-space: normal; overflow-wrap: anywhere;">
          <div style="overflow-wrap: anywhere;">${params.name}</div>
          <div>Value: <b>${params.value?.toLocaleString()}</b></div>
          <div>Percentage: <b>${params.percent}%</b></div>
        </div>
      `
      },
      legend: {
        orient: 'vertical',
        left: 'center',
        textStyle: { fontSize: 12 },
        inactiveColor: '#B1B2B5'
      },
      series
    };
  }, [accKey, labelFormatter, projects, selectedStatus, selectedType]);

  const handleClick = useCallback(
    params => {
      const name = params.name;

      setSelectedType(prev => (prev === name ? null : name));
      onTypeClick?.(name);
    },
    [onTypeClick]
  );

  return (
    <ChartCard title={title} height="400px">
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
