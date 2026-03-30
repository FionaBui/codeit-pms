import { Card } from 'antd';
export default function ChartCard({ title, children }) {
  return (
    <Card
      title={title}
      variant="borderless"
      styles={{
        body: { padding: 0 }
      }}
    >
      <div style={{ width: '100%', height: 600 }}>{children}</div>
    </Card>
  );
}
