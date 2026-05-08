import { Button, Card, Typography, Select, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { dayjs } from '@codeit/utils';

const { Text } = Typography;

function getMonthsBetween(startDate, endDate) {
  if (!startDate || !endDate) {
    return [];
  }

  const months = [];

  let current = dayjs(startDate).startOf('month');
  const end = dayjs(endDate).startOf('month');

  while (current.isBefore(end) || current.isSame(end)) {
    months.push({
      label: current.format('MMM YYYY'),
      value: current.format('YYYY-MM-DD')
    });

    current = current.add(1, 'month');
  }

  return months;
}

export default function ResourceAssignment({
  resources = [],
  projectStartDate,
  projectEndDate,
  value = [],
  onChange
}) {
  function addResourceRow() {
    const newRow = {
      resource: null,
      allocation: []
    };

    onChange([...value, newRow]);
  }

  function updateRow(index, field, fieldValue) {
    const updated = [...value];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue
    };

    onChange(updated);
  }

  function removeRow(index) {
    const updated = value.filter((_, i) => i !== index);

    onChange(updated);
  }

  function updateAllocation(index, monthValue, percent) {
    const updated = value.map((row, rowIndex) => {
      if (rowIndex !== index) {
        return row;
      }

      const existingAllocation = row.allocation || [];

      const hasMonth = existingAllocation.some(
        item =>
          dayjs(item.month).startOf('month').format('YYYY-MM-DD') === monthValue
      );

      const nextAllocation = hasMonth
        ? existingAllocation.map(item =>
            dayjs(item.month).startOf('month').format('YYYY-MM-DD') ===
            monthValue
              ? {
                  ...item,
                  month: monthValue,
                  percent: percent || 0
                }
              : item
          )
        : [
            ...existingAllocation,
            {
              month: monthValue,
              percent: percent || 0
            }
          ];

      return {
        ...row,
        allocation: nextAllocation
      };
    });

    onChange(updated);
  }

  function getAllocationValue(row, monthValue) {
    const found = row.allocation.find(
      item =>
        dayjs(item.month).startOf('month').format('YYYY-MM-DD') === monthValue
    );

    return found ? found.percent : 0;
  }

  const months = getMonthsBetween(projectStartDate, projectEndDate);

  return (
    <Card
      title="Resource Assignment"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addResourceRow}>
          Add Resource
        </Button>
      }
    >
      {value.length === 0 && (
        <Text type="secondary">No resources assigned yet.</Text>
      )}
      {value.length > 0 && (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <table
            style={{
              minWidth: 240 + months.length * 180 + 60,
              width: 'max-content',
              borderCollapse: 'separate',
              borderSpacing: '0 12px'
            }}
          >
            <thead>
              <tr>
                <th style={{ width: 240, textAlign: 'left', paddingRight: 16 }}>
                  Resource
                </th>

                {months.map(month => (
                  <th
                    key={month.value}
                    style={{ width: 180, textAlign: 'left', paddingRight: 16 }}
                  >
                    {month.label}
                  </th>
                ))}

                <th style={{ width: 60 }} />
              </tr>
            </thead>

            <tbody>
              {value.map((row, index) => (
                <tr key={index}>
                  <td style={{ width: 240, paddingRight: 16 }}>
                    <Select
                      placeholder="Select resource"
                      style={{ width: '100%' }}
                      value={row.resource}
                      onChange={selectedValue => {
                        updateRow(index, 'resource', selectedValue);
                      }}
                      options={resources.map(resource => ({
                        label: resource.name,
                        value: resource._id
                      }))}
                    />
                  </td>

                  {months.map(month => (
                    <td
                      key={month.value}
                      style={{ width: 180, paddingRight: 16 }}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: '100%' }}
                        value={getAllocationValue(row, month.value)}
                        onChange={number => {
                          updateAllocation(index, month.value, number);
                        }}
                      />
                    </td>
                  ))}

                  <td style={{ width: 60 }}>
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        removeRow(index);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
