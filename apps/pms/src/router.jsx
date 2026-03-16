import { useState } from 'react';
import { MainLayout } from '@codeit/ui';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { Drawer, Segmented } from 'antd';
import { RequireAuth, useAuth } from '@codeit/auth';
import { Home } from './pages/Home';
import { HomeOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';

function PmsLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuMode, setMenuMode] = useState('vertical');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    { key: 'home', label: 'Home', icon: <HomeOutlined />, onClick: () => navigate('/') },
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <>
      <MainLayout
        title="PMS"
        tagline="by CodeIT"
        menuItems={menuItems}
        menuMode={menuMode}
        onSettingsClick={() => setSettingsOpen(true)}
        userMenuItems={[
          {
            key: 'logout',
            label: 'Logout',
            onClick: () => logout(),
          },
        ]}
      />
      <Drawer
        placement="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={null}
        closable={false}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Menu layout</div>
          <Segmented
            block
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
            ]}
            value={menuMode}
            onChange={setMenuMode}
          />
        </div>
      </Drawer>
    </>
  );
}

function PlaceholderPage({ name }) {
  return (
    <div style={{ padding: 24 }}>
      Welcome to {name}. (Example page for menu test.)
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth loginPath="/login">
        <PmsLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <PlaceholderPage name="Dashboard" /> },
      { path: 'settings', element: <PlaceholderPage name="Settings" /> },
    ],
  },
]);
