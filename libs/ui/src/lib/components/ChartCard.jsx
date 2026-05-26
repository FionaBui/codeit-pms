import { Card } from 'antd';
export default function ChartCard({
  title,
  children,
  height = '40vh',
  className,
  classNames,
  ...props
}) {
  const bodyClassName = ['flex min-h-0 flex-1 flex-col !p-0', classNames?.body]
    .filter(Boolean)
    .join(' ');
  const cardClassNames = { ...classNames, body: bodyClassName };
  const cardClassName = [
    'flex h-full min-h-0 min-w-0 w-full flex-col',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card
      title={title}
      variant="borderless"
      styles={{
        body: { padding: 0 }
      }}
      size="small"
      className={cardClassName}
      classNames={cardClassNames}
      {...props}
    >
      <div style={{ width: '100%', height }} className="min-h-0 flex-1">
        {children}
      </div>
    </Card>
  );
}
