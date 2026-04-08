import EChartsReact from 'echarts-for-react';
import { forwardRef } from 'react';

/**
 * @param {{
 *   option: import('echarts').EChartsOption;
 *   onEvents?: Record<string, (params: unknown) => void>;
 *   height?: string | number;
 *   loading?: boolean;
 *   notMerge?: boolean;
 *   theme?: string | object;
 *   renderer?: 'canvas' | 'svg';
 *   style?: React.CSSProperties;
 *   className?: string;
 * }} props
 */
const BaseChart = forwardRef(function (
  {
    option,
    onEvents,
    height = '100%',
    loading = false,
    notMerge = true,
    theme,
    renderer = 'canvas',
    style,
    className,
  },
  ref
) {
  return (
    <EChartsReact
      ref={ref}
      option={option}
      notMerge={notMerge}
      showLoading={loading}
      theme={theme}
      opts={{ renderer }}
      onEvents={onEvents}
      style={{ height, width: '100%', ...style }}
      className={className}
    />
  );
});

export default BaseChart;
