import { BaseChart, ChartCard } from "@codeit/ui";
import { useMemo, useState, useCallback, useEffect } from "react";

export const ProjectByTypeChart = ({ title = "Projects by Type", projects = [], onTypeClick, accKey, labelFormatter, selectedType: inputSelectedType }) => {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (inputSelectedType !== selectedType)
    setSelectedType(inputSelectedType);
  }, [inputSelectedType]);

  const option = useMemo(() => {
    const counts = projects.reduce((acc, { type, [accKey]: v }) => {
      acc[type] = (acc[type] || 0) + (v || 1);

      return acc;
    }, {});

    const data = Object.entries(counts).map(([type, count]) => ({
      name: type,
      value: count,
      itemStyle: {
        opacity: !selectedType || selectedType === type ? 1 : 0.25,
      },
    }));

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
      `,
      },
      legend: {
        orient: 'vertical',
        left: 'center',
        textStyle: { fontSize: 12 },
        inactiveColor: '#B1B2B5'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          center: ['50%', '40%'],
          selectedMode: false,
          data,
          label: {
            position: 'outside',
            formatter: labelFormatter || (params => {
              const shortName = params.name.split(':')[0];
              return `${shortName}: ${params.value?.toLocaleString()} (${params.percent}%)`;
            }),
            fontSize: 12,
            width: 120,
            overflow: 'break',
            distanceToLabelLine: 5,
          },
          labelLine: { show: true, length: 20, length2: 15 },
          emphasis: { scale: true, scaleSize: 6 },
        },
      ],
    };
  }, [projects, selectedType]);

  const handleClick = useCallback(params => {
    const name = params.name;

    setSelectedType(prev => (prev === name ? null : name));
    onTypeClick?.(name);
  }, [onTypeClick]);

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
