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
  message,
  Modal
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../api/projectApi.js';
import { listResources } from '../../api/resourceApi.js';
import {
  getResourceAllocationsByProject,
  saveResourceAllocationsByProject,
  getResourceAllocationForNextMonths
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

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [resourceAssignments, setResourceAssignments] = useState([]);
  const [allResourceAllocations, setAllResourceAllocations] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
    fetchResources();
  }, []);

  async function fetchAllResourceAllocations() {
    try {
      const data = await getResourceAllocationForNextMonths(12);
      setAllResourceAllocations(data);
    } catch (error) {
      console.error('Failed to load all resource allocations:', error);
      setAllResourceAllocations([]);
    }
  }

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

  function clearAllFilters() {
    setSearchText('');
    setFilteredInfo({});
    setSortedInfo({});
  }

  function openCreateDrawer() {
    setEditingProject(null);
    fetchAllResourceAllocations();

    form.resetFields();
    setResourceAssignments([]);
    setIsDrawerOpen(true);
  }

  async function openEditDrawer(project) {
    setEditingProject(project);
    await fetchAllResourceAllocations();

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

  function handleDeleteProject(project) {
    Modal.confirm({
      title: 'Delete project',
      content: `You're about to delete "${project.name}". This action cannot be undone.`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true
      },
      centered: true,

      async onOk() {
        try {
          setLoading(true);

          await deleteProject(project._id);

          message.success('Project deleted successfully', 3);

          await fetchProjects();
        } catch (error) {
          console.error('Delete project failed:', error);

          message.error('Failed to delete project', 3);
        } finally {
          setLoading(false);
        }
      }
    });
  }

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1
  };

  function createFilters(data, field, getValue = item => item[field]) {
    return Array.from(
      new Set(data.map(item => getValue(item)).filter(Boolean))
    ).map(value => ({
      text: value,
      value
    }));
  }

  const typeFilters = createFilters(projects, 'type');
  const statusFilters = createFilters(projects, 'status');
  const managerFilters = createFilters(
    projects,
    'manager',
    project => project.manager?.name
  );

  const columns = [
    {
      title: <div style={{ paddingLeft: 20 }}>Project</div>,
      paddingLeft: '20px',
      dataIndex: 'shortName',
      key: 'shortName',
      render: (_, project) => (
        <div style={{ paddingLeft: 20 }}>
          <Space orientation="vertical" size={0}>
            <Text strong>{project.shortName}</Text>

            <Text
              type="secondary"
              style={{
                fontSize: 12,
                whiteSpace: 'normal'
              }}
            >
              {project.name}
            </Text>
          </Space>
        </div>
      )
    },
    {
      title: 'Contact',
      dataIndex: 'manager',
      key: 'manager',
      filters: managerFilters,
      filteredValue: filteredInfo.manager || null,
      onFilter: (value, record) => record.manager?.name === value,
      render: manager => manager?.name
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: typeFilters,
      filteredValue: filteredInfo.type || null,
      onFilter: (value, record) => record.type === value,
      render: type => <Text>{type?.split(':')[0]}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: status => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      sortOrder: sortedInfo.columnKey === 'priority' ? sortedInfo.order : null,
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
        <Space>
          <Button
            style={{
              borderColor: '#1677ff',
              color: '#1677ff'
            }}
            size="small"
            icon={<EditOutlined />}
            color="primary"
            onClick={() => openEditDrawer(project)}
          ></Button>

          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProject(project)}
          ></Button>
        </Space>
      )
    }
  ];

  const projectTypes = Array.from(
    new Set(projects.map(project => project.type).filter(Boolean))
  );

  const projectStatuses = Array.from(
    new Set(projects.map(project => project.status).filter(Boolean))
  );

  const projectPriorities = Array.from(
    new Set(projects.map(project => project.priority).filter(Boolean))
  );

  return (
    <ChartCard title="Project Management" height="85vh">
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        {/* Summary */}
        <Row gutter={[16, 16]} style={{ margin: '12px 20px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Total projects"
                value={summary.totalProjects}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Active projects"
                value={summary.activeProjects}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="High priority"
                value={summary.highPriorityProjects}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Planned hours"
                value={summary.totalPlannedHours}
                suffix="h"
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search */}

        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Space size={10}>
              <Title level={5} style={{ margin: 0, padding: 20 }}>
                All Projects
              </Title>

              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search project, contact person or status"
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
                style={{ width: 300 }}
              />

              <Button onClick={clearAllFilters}>Clear</Button>
            </Space>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateDrawer}
              style={{ marginRight: 20 }}
            >
              New project
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredProjects}
          loading={loading}
          pagination={false}
          size="small"
          onChange={(_, filters, sorter) => {
            setFilteredInfo(filters);
            setSortedInfo(sorter);
          }}
        />
      </Space>

      {/* Drawer */}
      <Drawer
        title={editingProject ? 'Edit project' : 'Create new project'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size={1200}
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
            typeOptions={projectTypes}
            statusOptions={projectStatuses}
            priorityOptions={projectPriorities}
          />
        </Form>
        <ResourceAssignment
          resources={resources}
          projectStartDate={Form.useWatch('startDate', form)}
          projectEndDate={Form.useWatch('endDate', form)}
          value={resourceAssignments}
          onChange={setResourceAssignments}
          existingAllocations={allResourceAllocations}
          currentProjectId={editingProject?._id}
        />
      </Drawer>
    </ChartCard>
  );
}
