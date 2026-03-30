import { Card } from 'antd';
export default function ChartCard({ title, children, height = 380 }) {
  return (
    <Card
      title={title}
      variant="borderless"
      styles={{
        body: { padding: 0 }
      }}
    >
      <div style={{ width: '100%', height }}>{children}</div>
    </Card>
  );
}
