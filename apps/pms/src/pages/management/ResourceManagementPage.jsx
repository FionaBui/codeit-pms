import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ContentLayout } from '@codeit/ui';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';

import {
  listResources,
  createResource,
  updateResource,
  deleteResource
} from '../../api/resourceApi';

const { Text } = Typography;

export default function ResourceManagementPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchText, setSearchText] = useState('');
  const tableContainerRef = useRef(null);
  const [tableScrollY, setTableScrollY] = useState(0);

  const [form] = Form.useForm();

  async function fetchResources() {
    try {
      setLoading(true);
      const data = await listResources();
      console.log('Resource', data);
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
      message.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResources();
  }, []);

  function openCreateDrawer() {
    setEditingResource(null);
    form.resetFields();
    setDrawerOpen(true);
  }

  function openEditDrawer(resource) {
    setEditingResource(resource);
    form.setFieldsValue({
      name: resource.name,
      title: resource.title
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingResource(null);
    form.resetFields();
  }

  function clearAllFilters() {
    setSearchText('');
  }

  async function handleSave(values) {
    try {
      const payload = {
        ...values
      };

      if (editingResource) {
        await updateResource(editingResource._id, payload);
        message.success('Resource updated successfully');
      } else {
        await createResource(payload);
        message.success('Resource created successfully');
      }

      closeDrawer();
      fetchResources();
    } catch (error) {
      console.error('Failed to save resource:', error);
      message.error('Failed to save resource');
    }
  }

  async function handleDelete(resourceId) {
    try {
      await deleteResource(resourceId);
      message.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource:', error);
      message.error('Failed to delete resource');
    }
  }

  const filteredResources = resources.filter(resource => {
    const keyword = searchText.toLowerCase();

    return (
      resource.name?.toLowerCase().includes(keyword) ||
      resource.title?.toLowerCase().includes(keyword) ||
      resource._id?.toLowerCase().includes(keyword)
    );
  });

  useLayoutEffect(() => {
    const container = tableContainerRef.current;
    if (!container) {
      return;
    }

    const updateScrollY = () => {
      const header =
        container.querySelector('.ant-table-thead') ??
        container.querySelector('.ant-table-header');
      const headerHeight = header?.getBoundingClientRect().height ?? 39;
      const nextScrollY = Math.max(
        Math.floor(container.clientHeight - headerHeight),
        120
      );

      setTableScrollY(nextScrollY);
    };

    updateScrollY();
    requestAnimationFrame(updateScrollY);

    const observer = new ResizeObserver(updateScrollY);
    observer.observe(container);

    return () => observer.disconnect();
  }, [loading, filteredResources.length]);

  const columns = [
    {
      title: 'Resource',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text>{record.name}</Text>
        </Space>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            style={{
              borderColor: '#1677ff',
              color: '#1677ff'
            }}
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
          />

          <Popconfirm
            title="Delete resource"
            description={`Are you sure you want to delete ${record.name}?`}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <ContentLayout
        title="Resource Management"
        actions={
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search resource or title"
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              style={{ width: 280 }}
            />

            <Button onClick={clearAllFilters}>Clear</Button>

            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
              New resource
            </Button>
          </Space>
        }
      >
        <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden">
          <div ref={tableContainerRef} className="min-h-0 flex-1 overflow-hidden">
            <Table
              rowKey="_id"
              loading={loading}
              columns={columns}
              size="small"
              dataSource={filteredResources}
              pagination={false}
              tableLayout="fixed"
              className="w-full min-w-0"
              scroll={tableScrollY > 0 ? { y: tableScrollY } : undefined}
            />
          </div>
        </div>
      </ContentLayout>

      <Drawer
        title={editingResource ? 'Edit resource' : 'Create resource'}
        open={drawerOpen}
        onClose={closeDrawer}
        size="default"
        destroyOnHidden
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Save
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter resource name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Software Development Manager" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
