import { Typography } from 'antd';

const { Title } = Typography;

/**
 * @typedef {Object} ContentLayoutProps
 * @property {React.ReactNode} title - Page heading
 * @property {React.ReactNode} [actions] - Optional controls shown to the right of the title
 * @property {React.ReactNode} children - Main page content
 * @property {number} [titleLevel=4] - Ant Design Title level
 */

/** Standard page shell: title row with optional actions, then main content. */
export const ContentLayout = ({ title, actions, children, titleLevel = 4 }) => (
  <div className="flex h-full min-h-0 w-full flex-col gap-2">
    <div className="flex shrink-0 items-center justify-between gap-2">
      <Title level={titleLevel} style={{ marginBottom: 0 }}>
        {title}
      </Title>
      {actions != null ? <div className="shrink-0">{actions}</div> : null}
    </div>
    <div className="min-h-0 flex-1 w-full overflow-auto">{children}</div>
  </div>
);
