import { Alert, Spin, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { listUsers } from '../../api/usersApi';

const { Title, Text } = Typography;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listUsers()
      .then((response) => {
        if (!cancelled) setUsers(response.data ?? []);
      })
      .catch((e) => {
        if (!cancelled) {
          const msg =
            e?.response?.data?.error?.message ??
            e?.message ??
            'Failed to load users';
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = [
    {
      title: 'Display name',
      dataIndex: 'displayName',
      key: 'displayName',
      sorter: (a, b) =>
        String(a.displayName ?? '').localeCompare(
          String(b.displayName ?? ''),
          undefined,
          { sensitivity: 'base' }
        ),
      render: (v) => v ?? '—'
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      key: 'mail',
      ellipsis: true,
      render: (v, row) => v ?? row.userPrincipalName ?? '—'
    },
    {
      title: 'Sign-in name',
      dataIndex: 'userPrincipalName',
      key: 'userPrincipalName',
      ellipsis: true,
      responsive: ['lg'],
      render: (v) => v ?? '—'
    },
    {
      title: 'Job title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      responsive: ['md'],
      ellipsis: true,
      render: (v) => v ?? '—'
    },
    {
      title: 'Active',
      dataIndex: 'accountEnabled',
      key: 'accountEnabled',
      width: 96,
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false }
      ],
      onFilter: (value, record) => record.accountEnabled === value,
      render: (v) => (v === false ? 'No' : 'Yes')
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        Tenant users
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Directory users from Microsoft Graph (delegated User.Read.All via API).
      </Text>

      {error && (
        <Alert
          type="error"
          message={error}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={{
            pageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: [25, 50, 100]
          }}
          scroll={{ x: true }}
        />
      </Spin>
    </div>
  );
}
