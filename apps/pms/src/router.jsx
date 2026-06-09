import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@codeit/ui';
import { createBrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import { Drawer, Segmented } from 'antd';
import { RequireAuth, useAuth } from '@codeit/auth';
import { ApiClientInit } from './api/ApiClientInit';
import { listMenus } from './api/menuApi';
import ProjectCountStatusPage from './pages/dashboard/ProjectCountStatusPage';
import ProjectsGanttPage from './pages/dashboard/ProjectsGanttPage';
import ResourcesAllocationsPage from './pages/dashboard/ResourcesAllocationsPage';
import HeadcountPage from './pages/dashboard/HeadcountPage';
import RawDataPage from './pages/dashboard/RawDataPage';
import ProjectManagementPage from './pages/management/ProjectManagementPage';
import ResourceManagementPage from './pages/management/ResourceManagementPage';
import Settings from './pages/Settings';

import {
  DashboardOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  TeamOutlined,
  ContactsOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

function PmsLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuMode, setMenuMode] = useState('vertical');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiMenus, setApiMenus] = useState(null);

  useEffect(() => {
    listMenus()
      .then(setApiMenus)
      .catch((err) => {
        console.error('Failed to load menus', err);
      });
  }, []);

  // const sectionLabelStyle = {
  //   fontSize: 12,
  //   fontWeight: 500,
  //   color: '#9fb8c1',
  //   letterSpacing: 0.5
  // };

  const menuItems = useMemo(() => [
    {
      key: 'project-count-status',
      label: 'Project Count & Status',
      icon: <DashboardOutlined />,
      onClick: () => navigate('/project-count-status')
    },
    {
      key: 'projects-gantt',
      label: 'Projects Gantt',
      icon: <ProjectOutlined />,
      onClick: () => navigate('/projects-gantt')
    },
    {
      key: 'resources-allocations',
      label: 'Resources Allocations',
      icon: <TeamOutlined />,
      onClick: () => navigate('/resources-allocations')
    },
    {
      key: 'headcount',
      label: 'Headcount',
      icon: <ContactsOutlined />,
      onClick: () => navigate('/headcount')
    },
    {
      key: 'raw-data',
      label: 'Raw Data Table',
      icon: <DatabaseOutlined />,
      onClick: () => navigate('/raw-data')
    },
    {
      type: 'divider',
      key: 'divider-1'
    },
    {
      key: 'project-management',
      label: 'Project Management',
      icon: <ScheduleOutlined />,
      onClick: () => navigate('/project-management')
    },
    {
      key: 'resource-management',
      label: 'Resource Management',
      icon: <TeamOutlined />,
      onClick: () => navigate('/resource-management')
    }
    // {
    //   key: 'settings',
    //   label: 'Settings',
    //   icon: <SettingOutlined />,
    //   onClick: () => navigate('/settings')
    // }
  ], [navigate]);

  const resolvedMenuItems = useMemo(() => {
    if (!apiMenus?.length) return menuItems;

    const divider = menuItems.find((item) => item.type === 'divider');
    const clientByKey = Object.fromEntries(
      menuItems
        .filter((item) => item.key && item.type !== 'divider')
        .map((item) => [item.key, item])
    );

    const sortedApiMenus = [...apiMenus].sort((a, b) => a.order - b.order);
    const merged = [];
    let prevGroup = null;

    for (const menuFromApi of sortedApiMenus) {
      if (prevGroup && menuFromApi.group !== prevGroup && divider) {
        merged.push(divider);
      }

      const menuClient = clientByKey[menuFromApi._id] ?? {};
      const { _id, ...rest } = menuFromApi;
      merged.push({ ...menuClient, ...rest, key: _id });
      prevGroup = menuFromApi.group;
    }

    return merged;
  }, [apiMenus, menuItems]);

  return (
    <>
      <MainLayout
        title="PMS"
        tagline="by CodeIT"
        menuItems={resolvedMenuItems}
        menuMode={menuMode}
        onSettingsClick={() => setSettingsOpen(true)}
        userMenuItems={[
          {
            key: 'logout',
            label: 'Logout',
            onClick: () => logout()
          }
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
              { label: 'Vertical', value: 'vertical' }
            ]}
            value={menuMode}
            onChange={setMenuMode}
          />
        </div>
      </Drawer>
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth loginPath="/login">
        <ApiClientInit>
          <PmsLayout />
        </ApiClientInit>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/project-count-status" replace /> },
      { path: 'project-count-status', element: <ProjectCountStatusPage /> },
      { path: 'projects-gantt', element: <ProjectsGanttPage /> },
      { path: 'resources-allocations', element: <ResourcesAllocationsPage /> },
      { path: 'headcount', element: <HeadcountPage /> },
      { path: 'raw-data', element: <RawDataPage /> },
      { path: 'project-management', element: <ProjectManagementPage /> },
      { path: 'resource-management', element: <ResourceManagementPage /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
]);
