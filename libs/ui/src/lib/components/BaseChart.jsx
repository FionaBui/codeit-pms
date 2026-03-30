import EChartsReact from 'echarts-for-react';
export default function BaseChart({ option, onEvents }) {
  return (
    <EChartsReact
      option={option}
      style={{ height: 600, width: '100%' }}
      onEvents={onEvents}
    ></EChartsReact>
  );
}
