import { useMemo, useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { BaseChart, CHART_COLORS } from '@codeit/ui';

const { Text } = Typography;

export function HeadCountPieChart({
  title,
  data = [],
  height = '100%',
  selectedProject,
  onSelectProject,
  projectColorMap = {},
  className
}) {
  const maxVisibleItems = 6;
  const [startIndex, setStartIndex] = useState(0);
  const rootClassName = [
    'flex w-full min-h-0 items-center gap-4',
    height === '100%' ? 'h-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');
  const rootStyle = height !== '100%' ? { height } : undefined;

  //   const hasSelectedProject = useMemo(() => {
  //     return data.some(item => item.name === selectedProject);
  //   }, [data, selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const selectedIndex = data.findIndex(item => item.name === selectedProject);

    if (selectedIndex === -1) {
      return;
    }

    if (selectedIndex < startIndex) {
      setStartIndex(selectedIndex);
      return;
    }

    if (selectedIndex >= startIndex + maxVisibleItems) {
      setStartIndex(selectedIndex - maxVisibleItems + 1);
    }
  }, [selectedProject, data, startIndex]);

  const chartData = useMemo(() => {
    return data.map((item, index) => {
      const isSelected = selectedProject === item.name;
      const isDimmed = selectedProject && !isSelected;

      const color =
        projectColorMap[item.name] || CHART_COLORS[index % CHART_COLORS.length];

      return {
        ...item,
        itemStyle: {
          color,
          opacity: isDimmed ? 0.18 : 1,
          borderWidth: isSelected ? 3 : 1
        },

        label: {
          show: true,
          formatter: params => `${params.value} (${params.percent}%)`,
          fontSize: 11,
          fontWeight: isSelected ? 700 : 400,
          opacity: isDimmed ? 0.25 : 1
        },

        labelLine: {
          show: true,
          length: 10,
          length2: 8,
          lineStyle: {
            opacity: isDimmed ? 0.25 : 1
          }
        }
      };
    });
  }, [data, selectedProject, projectColorMap]);

  const option = useMemo(
    () => ({
      title: {
        text: title,
        left: 20,
        top: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: params => {
          return `
            <strong>${params.name}</strong><br />
            Headcount: ${params.value}<br />
            Percent: ${params.percent}%
          `;
        }
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '70%',
          center: ['50%', '58%'],
          data: chartData,
          label: {
            formatter: params => `${params.value} (${params.percent}%)`,
            fontSize: 11
          },
          labelLine: {
            length: 10,
            length2: 8
          },
          emphasis: {
            scale: true,
            scaleSize: 5
          }
        }
      ]
    }),
    [title, chartData]
  );

  const visibleItems = data.slice(startIndex, startIndex + maxVisibleItems);
  const canScrollUp = startIndex > 0;
  const canScrollDown = startIndex + maxVisibleItems < data.length;

  function handleProjectSelect(projectName) {
    if (selectedProject === projectName) {
      onSelectProject(null);
      return;
    }

    onSelectProject(projectName);
  }

  function scrollUp() {
    if (!canScrollUp) {
      return;
    }

    setStartIndex(prev => Math.max(prev - 1, 0));
  }

  function scrollDown() {
    if (!canScrollDown) {
      return;
    }

    setStartIndex(prev => prev + 1);
  }

  const onEvents = {
    click: params => {
      if (params.componentType !== 'series') {
        return;
      }

      handleProjectSelect(params.name);
    }
  };

  return (
    <div className={rootClassName} style={rootStyle}>
      <div className="h-full min-h-0 w-[58%]">
        <BaseChart
          option={option}
          onEvents={onEvents}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col justify-center">
        <Text
          strong
          style={{
            fontSize: 14,
            marginBottom: 6
          }}
        >
          Project
        </Text>

        <div className="min-h-0 flex-1 overflow-hidden">
          {visibleItems.map((item, index) => {
            const color =
              projectColorMap[item.name] ||
              CHART_COLORS[index % CHART_COLORS.length];

            const isSelected = selectedProject === item.name;
            const isDimmed = selectedProject && !isSelected;

            return (
              <div
                key={item.name}
                onClick={() => handleProjectSelect(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.35 : 1,
                  marginBottom: 10
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '60%',
                    backgroundColor: color,
                    flexShrink: 0
                  }}
                />

                <Text
                  ellipsis={{ tooltip: item.name }}
                  style={{
                    flex: 1
                  }}
                >
                  {item.name}
                </Text>
              </div>
            );
          })}
        </div>

        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}
        >
          <Button
            type="text"
            size="small"
            icon={<CaretDownFilled />}
            onClick={scrollDown}
            disabled={!canScrollDown}
          />
          <Button
            type="text"
            size="small"
            icon={<CaretUpFilled />}
            onClick={scrollUp}
            disabled={!canScrollUp}
          />
        </div>
      </div>
    </div>
  );
}
