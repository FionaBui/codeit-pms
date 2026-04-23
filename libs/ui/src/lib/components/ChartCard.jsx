import { Card } from 'antd';
export default function ChartCard({
  title,
  children,
  height = '40vh',
  className,
  ...props
}) {
  return (
    <Card
      title={title}
      variant="borderless"
      styles={{
        body: { padding: 0 }
      }}
      size="small"
      className={className}
      {...props}
    >
      <div style={{ width: '100%', height }} className="flex-1">
        {children}
      </div>
    </Card>
  );
}
