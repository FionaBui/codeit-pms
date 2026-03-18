import { Card } from 'antd';
export default function ChartCard({ title, children, height = 450 }) {
  return (
    <Card title={title} variant="borderless">
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
