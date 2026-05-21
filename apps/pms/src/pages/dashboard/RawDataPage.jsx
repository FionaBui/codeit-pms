import { useEffect, useMemo, useState } from 'react';
import { Card, Input, Table, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { dayjs } from '@codeit/utils';
import { getResourceAllocationForNextMonths } from '../../api/resourceAllocationApi';

const { Title } = Typography;

const MONTHS = 12;

export default function RawDataPage() {
  const [loading, setLoading] = useState(false);
  const [allocationData, setAllocationData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadRawData();
  }, []);

  async function loadRawData() {
    try {
      setLoading(true);
      const data = await getResourceAllocationForNextMonths(MONTHS);
      setAllocationData(data);
    } finally {
      setLoading(false);
    }
  }

  const months = useMemo(() => {
    return Array.from({ length: MONTHS }, (_, index) => {
      const month = dayjs().startOf('month').add(index, 'month');

      return {
        key: month.format('YYYY-MM-DD'),
        label: month.format('MMM YY')
      };
    });
  }, []);

  const tableData = useMemo(() => {
    const resourceMap = new Map();

    allocationData.forEach(item => {
      const resourceId = item.resourceId;
      const resourceName = item.resource;

      if (!resourceMap.has(resourceId)) {
        resourceMap.set(resourceId, {
          resourceId,
          name: resourceName
        });
      }

      const row = resourceMap.get(resourceId);

      item.allocation?.forEach(allocation => {
        const monthKey = dayjs(allocation.month)
          .startOf('month')
          .format('YYYY-MM-DD');
        const percent = Math.round((allocation.percent || 0) * 100);

        row[monthKey] = (row[monthKey] || 0) + percent;
      });
    });

    return Array.from(resourceMap.values());
  }, [allocationData]);

  const filteredData = useMemo(() => {
    return tableData.filter(row =>
      row.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tableData, searchText]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 180,
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      ...months.map(month => ({
        title: month.label,
        dataIndex: month.key,
        key: month.key,
        align: 'right',
        width: 120,
        sorter: (a, b) => (a[month.key] || 0) - (b[month.key] || 0),
        render: value => {
          const percent = value || 0;
          const isOverAllocated = percent > 100;

          return (
            <span style={{ color: isOverAllocated ? '#cf1322' : undefined }}>
              {percent} %
            </span>
          );
        }
      }))
    ];
  }, [months]);

  return (
    <Card>
      <Title level={3}>Raw Data Table</Title>

      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search resource name"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        loading={loading}
        rowKey="resourceId"
        columns={columns}
        dataSource={filteredData}
        bordered={false}
        pagination={false}
        scroll={{ x: 'max-content', y: '65vh' }}
        summary={pageData => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <strong>Total</strong>
                </Table.Summary.Cell>

                {months.map((month, index) => {
                  const total = pageData.reduce(
                    (sum, row) => sum + (row[month.key] || 0),
                    0
                  );

                  return (
                    <Table.Summary.Cell
                      key={month.key}
                      index={index + 1}
                      align="right"
                    >
                      <strong>{total} %</strong>
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </Card>
  );
}
