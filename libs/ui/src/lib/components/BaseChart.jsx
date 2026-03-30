import EChartsReact from 'echarts-for-react';
export default function BaseChart({ option, onEvents, height = '100%' }) {
  return (
    <EChartsReact
      option={option}
      style={{ height, width: '100%' }}
      onEvents={onEvents}
    ></EChartsReact>
  );
}
