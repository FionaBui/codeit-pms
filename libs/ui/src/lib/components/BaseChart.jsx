import EChartsReact from 'echarts-for-react';
export default function BaseChart({ option, onEvents, height = '40vh' }) {
  return (
    <EChartsReact
      option={option}
      style={{ height, width: '100%' }}
      onEvents={onEvents}
    ></EChartsReact>
  );
}
