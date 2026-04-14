import { useState } from 'react';
import { ConfigProvider, Dropdown, Layout, Menu } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';
import { useAuth } from '@codeit/auth';

/**
 * Props for MainLayout. All optional so each app can customize.
 * @typedef {Object} MainLayoutProps
 * @property {React.ReactNode} [logo] - Logo or brand element (default: link to "/")
 * @property {string} [title] - App title shown next to logo
 * @property {string} [tagline] - Optional tagline (e.g. "by CodeIT")
 * @property {Array<{ key: string; label: React.ReactNode; icon?: React.ReactNode; onClick?: () => void }>} [menuItems] - Main nav items
 * @property {Array<{ key: string; label: React.ReactNode; onClick?: () => void }>} [userMenuItems] - User dropdown items (e.g. Logout)
 * @property {React.ReactNode} [userTrigger] - Custom trigger for user dropdown (default: UserOutlined icon)
 * @property {() => void} [onSettingsClick] - When provided, shows a settings icon next to the user menu that calls this on click
 * @property {'horizontal' | 'vertical'} [menuMode] - Menu layout: horizontal in header or vertical in left sidebar (default: 'horizontal')
 * @property {React.CSSProperties} [contentStyle] - Content area styles
 */

export const MainLayout = ({
  logo,
  title,
  tagline,
  menuItems = [],
  userMenuItems = [],
  userTrigger,
  onSettingsClick,
  menuMode = 'vertical',
  contentStyle = { padding: '8px' }
}) => {
  const defaultLogo = (
    <a href="/" className="shrink-0 flex gap-x-2 items-center leading-normal">
      <p className="text-white truncate flex text-lg">
        {title != null && <span>{title}</span>}
        {tagline != null && (
          <span className="text-primary ml-1">{tagline}</span>
        )}
        {title == null && tagline == null && <span>App</span>}
      </p>
    </a>
  );

  const menuItemConfig = menuItems.map(({ key, label, icon, onClick }) => ({
    key,
    label,
    icon,
    onClick
  }));

  const dropdownItems = userMenuItems.map(({ key, label, onClick }) => ({
    key,
    label,
    onClick
  }));

  const { user } = useAuth();

  console.log(user);

  const headerRight = (onSettingsClick != null ||
    dropdownItems.length > 0 ||
    userTrigger) && (
    <div className="flex gap-x-2 ml-auto items-center justify-end">
      {onSettingsClick != null && (
        <SettingOutlined
          className="text-lg text-white shrink-0 cursor-pointer"
          onClick={onSettingsClick}
        />
      )}
      {(dropdownItems.length > 0 || userTrigger) && (
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <div className="flex gap-x-1 items-center">
            {userTrigger != null ? (
              userTrigger
            ) : (
              <div className="flex items-center gap-x-1 text-white cursor-pointer">
                <UserOutlined className="text-2xl shrink-0" />
                <div className="text-white">
                  <p>{user?.displayName}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </Dropdown>
      )}
    </div>
  );

  const menuTheme = {
    components: {
      Menu: {
        itemColor: 'white',
        horizontalItemHoverBg: '#024753',
        horizontalItemSelectedBg: '#024753',
        /* vertical menu: same selected/hover as horizontal */
        itemHoverBg: '#024753',
        itemSelectedBg: '#024753'
      }
    }
  };

  const [collapsed, setCollapsed] = useState(false);

  if (menuMode === 'vertical') {
    const sidebarItems = menuItemConfig.map(item => {
      if (!collapsed) {
        return item;
      }
      const text = typeof item.label === 'string' ? item.label : undefined;

      return {
        ...item,
        // In collapsed mode, rely on Sider's built-in tooltip via `title`
        label: null,
        title: text
      };
    });

    return (
      <Layout className="h-screen overflow-hidden">
        <Layout.Header
          className="h-12 flex items-stretch px-2 md:px-5 leading-normal bg-brand z-10"
          style={{ boxShadow: '0px 4px 4px 0px #00000040' }}
        >
          {logo != null ? logo : defaultLogo}
          <div style={{ flex: 1 }} />
          {headerRight}
        </Layout.Header>
        <Layout className="flex-1 overflow-hidden">
          <Layout.Sider
            collapsible
            width={250}
            collapsedWidth={64}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            theme="dark"
            className="bg-brand"
          >
            <ConfigProvider theme={menuTheme}>
              <Menu
                mode="vertical"
                items={sidebarItems}
                className="main-layout-sidebar-menu border-none h-full"
                style={{ backgroundColor: 'inherit' }}
                triggerSubMenuAction="click"
                selectedKeys={location.pathname?.split('/')}
              />
            </ConfigProvider>
          </Layout.Sider>
          <Layout.Content className="flex-1 overflow-auto" style={contentStyle}>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className="h-screen overflow-hidden">
      <Layout.Header
        className="h-12 flex items-stretch px-2 md:px-5 leading-normal bg-brand z-10"
        style={{ boxShadow: '0px 4px 4px 0px #00000040' }}
      >
        {logo != null ? logo : defaultLogo}
        <ConfigProvider theme={menuTheme}>
          <Menu
            mode="horizontal"
            items={menuItemConfig}
            style={{
              flex: 1,
              minWidth: 0,
              height: '100%',
              backgroundColor: 'inherit',
              alignItems: 'center'
            }}
            className="main-layout-header-menu h-full grow justify-center items-center border-none"
            triggerSubMenuAction="click"
            selectedKeys={location.pathname?.split('/')}
          />
        </ConfigProvider>
        {headerRight}
      </Layout.Header>
      <Layout.Content className="flex-1 overflow-auto" style={contentStyle}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};
