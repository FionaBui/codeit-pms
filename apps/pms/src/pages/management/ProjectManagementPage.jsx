import React, { useEffect, useMemo, useState } from 'react';
import { ChartCard } from '@codeit/ui';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Drawer,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message
} from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  listProjects,
  createProject,
  updateProject
} from '../../api/projectApi.js';
import { listResources } from '../../api/resourceApi.js';
import {
  getResourceAllocationsByProject,
  saveResourceAllocationsByProject
} from '../../api/resourceAllocationApi.js';
import ResourceAssignment from '../../components/management/ResourceAssignment.jsx';
import ProjectFormFields from '../../components/management/ProjectFormFields.jsx';

const { Title, Text } = Typography;

const statusColors = {
  plan: 'default',
  execution: 'processing',
  closing: 'warning',
  finished: 'success'
};

const priorityColors = {
  low: 'green',
  medium: 'blue',
  high: 'red'
};

const projectTypes = [
  'Type 1: new development outside Core Services',
  'Type 2: development / improvements inside Core Services',
  'Type 3: Customizations & Change requests',
  'Type 4: Daily support & Continuous improvements'
];

const projectStatuses = ['plan', 'execution', 'closing', 'finished'];

const projectPriorities = ['low', 'medium', 'high'];

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [resourceAssignments, setResourceAssignments] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
    fetchResources();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);

      const res = await listProjects();
      console.log('API response:', res.data);

      setProjects(res.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchResources() {
    try {
      const res = await listResources();
      console.log('API resources:', res.data);

      const resourcesArray = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
          ? res.data
          : [];

      setResources(resourcesArray);
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
  }
  console.log('projects', projects);
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const keyword = searchText.toLowerCase();

      return (
        project.name?.toLowerCase().includes(keyword) ||
        project.shortName?.toLowerCase().includes(keyword) ||
        project.manager.name?.toLowerCase().includes(keyword) ||
        project.status?.toLowerCase().includes(keyword)
      );
    });
  }, [projects, searchText]);

  const summary = useMemo(() => {
    const totalProjects = projects.length;

    const activeProjects = projects.filter(
      project => project.status !== 'finished'
    ).length;

    const highPriorityProjects = projects.filter(
      project => project.priority === 'high'
    ).length;

    const totalPlannedHours = projects.reduce(
      (sum, project) => sum + project.plannedManhours,
      0
    );

    return {
      totalProjects,
      activeProjects,
      highPriorityProjects,
      totalPlannedHours
    };
  }, [projects]);

  function openCreateDrawer() {
    setEditingProject(null);

    form.resetFields();
    setResourceAssignments([]);
    setIsDrawerOpen(true);
  }

  async function openEditDrawer(project) {
    setEditingProject(project);

    form.setFieldsValue({
      ...project,
      manager: project.manager._id,
      completion: Math.round((project.completion || 0) * 100),
      startDate: dayjs(project.startDate),
      endDate: dayjs(project.endDate)
    });

    try {
      const allocations = await getResourceAllocationsByProject(project._id);

      const formattedAllocations = allocations.map(row => ({
        resource: row.resourceId,
        allocation: (row.allocation || []).map(item => ({
          month: dayjs(item.month).startOf('month').format('YYYY-MM-DD'),
          percent: Number(item.percent || 0) * 100
        }))
      }));

      setResourceAssignments(formattedAllocations);
    } catch (error) {
      console.error('Failed to load project allocations:', error);

      setResourceAssignments([]);
    }

    setIsDrawerOpen(true);
  }

  async function handleSaveProject(values) {
    const formattedProject = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      completion: values.completion / 100
    };

    try {
      setLoading(true);

      if (editingProject) {
        await updateProject(editingProject._id, formattedProject);

        await saveResourceAllocationsByProject(
          editingProject._id,
          resourceAssignments.map(row => ({
            resource: row.resource,
            allocation: row.allocation
          }))
        );

        message.success('Project updated successfully', 3);
      } else {
        await createProject(formattedProject);
        message.success('Project created successfully', 3);
        form.resetFields();
      }

      setIsDrawerOpen(false);

      await fetchProjects();
    } catch (error) {
      console.error('Save project failed:', error);
      message.error('Failed to save project', 3);
    } finally {
      setLoading(false);
    }
  }

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: 'shortName',
      key: 'shortName',
      sorter: (a, b) => a.shortName.localeCompare(b.shortName),
      render: (_, project) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{project.shortName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {project.name}
          </Text>
        </Space>
      )
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: manager => manager.name
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',

      filters: [
        {
          text: 'Type 1: new development outside Core Services',
          value: 'Type 1: new development outside Core Services'
        },
        {
          text: 'Type 2: development / improvements inside Core Services',
          value: 'Type 2: development / improvements inside Core Services'
        },
        {
          text: 'Type 3: Customizations & Change requests',
          value: 'Type 3: Customizations & Change requests'
        },
        {
          text: 'Type 4: Daily support & Continuous improvements',
          value: 'Type 4: Daily support & Continuous improvements'
        }
      ],

      onFilter: (value, record) => record.type === value,

      render: type => <Text>{type.split(':')[0]}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      defaultSortOrder: 'descend',
      sorter: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      render: priority => (
        <Tag color={priorityColors[priority]}>{priority.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Progress',
      dataIndex: 'completion',
      key: 'completion',
      render: completion => (
        <Progress percent={Math.round(completion * 100)} size="small" />
      )
    },
    {
      title: 'Planned',
      dataIndex: 'plannedManhours',
      key: 'plannedManhours',
      render: value => `${value} h`
    },
    {
      title: 'Actual',
      dataIndex: 'actualManhours',
      key: 'actualManhours',
      render: value => `${value} h`
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, project) => (
        <Button icon={<EditOutlined />} onClick={() => openEditDrawer(project)}>
          Edit
        </Button>
      )
    }
  ];

  return (
    <ChartCard title="Project Management" height="85vh">
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        {/* Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Total projects" value={summary.totalProjects} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active projects"
                value={summary.activeProjects}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="High priority"
                value={summary.highPriorityProjects}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Planned hours"
                value={summary.totalPlannedHours}
                suffix="h"
              />
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <Title level={4} style={{ margin: 0 }}>
                All Projects
              </Title>
            </Col>

            <Col xs={24} md={12}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="Search project, manager or status"
                  value={searchText}
                  onChange={event => setSearchText(event.target.value)}
                  style={{ width: 300 }}
                />

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreateDrawer}
                >
                  New project
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredProjects}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Space>

      {/* Drawer */}
      <Drawer
        title={editingProject ? 'Edit project' : 'Create new project'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size={980}
        afterOpenChange={open => {
          if (!open) {
            form.resetFields();
            setEditingProject(null);
            setResourceAssignments([]);
          }
        }}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>

            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProject}
          initialValues={{
            status: 'plan',
            priority: 'medium',
            completion: 0,
            plannedManhours: 0,
            actualManhours: 0
          }}
        >
          <ProjectFormFields
            resources={resources}
            projectTypes={projectTypes}
            projectStatuses={projectStatuses}
            projectPriorities={projectPriorities}
          />
        </Form>
        <ResourceAssignment
          resources={resources}
          projectStartDate={Form.useWatch('startDate', form)}
          projectEndDate={Form.useWatch('endDate', form)}
          value={resourceAssignments}
          onChange={setResourceAssignments}
        />
      </Drawer>
    </ChartCard>
  );
}
