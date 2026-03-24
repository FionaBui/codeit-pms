import EChartsReact from 'echarts-for-react';
export default function BaseChart({ option, onEvents }) {
  return (
    <EChartsReact
      option={option}
      style={{ height: 450, width: '100%' }}
      onEvents={onEvents}
    ></EChartsReact>
  );
}
