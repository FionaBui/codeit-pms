import { useEffect, useState } from 'react';
import {
  Button,
  Card,
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

const { Title, Text } = Typography;

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function ResourceManagementPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchText, setSearchText] = useState('');

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

  const columns = [
    {
      title: 'Resource',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text>{record.name}</Text>
          {/* <Text type="secondary" style={{ fontSize: 12 }}>
            {record._id}
          </Text> */}
        </Space>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    // {
    //   title: 'Created by',
    //   dataIndex: 'createdBy',
    //   key: 'createdBy',
    //   width: 120
    // },
    // {
    //   title: 'Updated by',
    //   dataIndex: 'updatedBy',
    //   key: 'updatedBy',
    //   width: 120
    // },
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
      <Card>
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              Resource Management
            </Title>

            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search resource or title"
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              style={{ width: 280 }}
            />
            <Button onClick={clearAllFilters}>Clear</Button>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateDrawer}
          >
            New resource
          </Button>
        </Space>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          size="small"
          dataSource={filteredResources}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>

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
