import React, { useMemo } from 'react';
import {
  Button,
  Card,
  Typography,
  Select,
  InputNumber,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
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
  onChange,
  existingAllocations = [],
  currentProjectId,
  loading = false
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
                  percent: percent ?? null
                }
              : item
          )
        : [
            ...existingAllocation,
            {
              month: monthValue,
              percent: percent ?? null
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

    return found ? found.percent : null;
  }

  const months = useMemo(() => {
    return getMonthsBetween(projectStartDate, projectEndDate);
  }, [projectStartDate, projectEndDate]);

  function getResourceName(resourceId) {
    const found = resources.find(resource => resource._id === resourceId);

    return found ? found.name : '';
  }

  function getExistingPercent(resourceId, monthValue) {
    return existingAllocations.reduce((sum, allocationRow) => {
      if (allocationRow.resourceId !== resourceId) {
        return sum;
      }

      if (allocationRow.projectId === currentProjectId) {
        return sum;
      }

      const monthItem = allocationRow.allocation?.find(
        item =>
          dayjs(item.month).startOf('month').format('YYYY-MM-DD') === monthValue
      );

      return sum + Number(monthItem?.percent || 0) * 100;
    }, 0);
  }

  function getTotalPercent(row, monthValue) {
    if (!row.resource) {
      return 0;
    }

    const currentProjectPercent = getAllocationValue(row, monthValue);
    const otherProjectsPercent = getExistingPercent(row.resource, monthValue);

    return currentProjectPercent + otherProjectsPercent;
  }

  function isRowOverloaded(row) {
    return months.some(month => getTotalPercent(row, month.value) > 100);
  }

  return (
    <Card
      title="Resource Assignment"
      loading={loading}
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
              minWidth: 240 + months.length * 100 + 60,
              width: 'max-content',
              borderCollapse: 'separate',
              borderSpacing: '0 12px'
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: 240,
                    textAlign: 'left',
                    paddingRight: 16
                  }}
                >
                  Resource
                </th>

                {months.map(month => (
                  <th
                    key={month.value}
                    style={{
                      width: 100,
                      textAlign: 'left',
                      paddingRight: 16
                    }}
                  >
                    {month.label}
                  </th>
                ))}

                <th style={{ width: 60 }} />
              </tr>
            </thead>

            <tbody>
              {value.map((row, index) => (
                <>
                  <tr key={index}>
                    <td
                      style={{
                        width: 240,
                        paddingRight: 16,
                        verticalAlign: 'top'
                      }}
                    >
                      <Select
                        placeholder="Select resource"
                        style={{ width: '100%', alignContent: 'top' }}
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

                    {months.map(month => {
                      const totalPercent = getTotalPercent(row, month.value);

                      const isOverloaded = totalPercent > 100;

                      return (
                        <td
                          key={month.value}
                          style={{
                            width: 100,
                            paddingRight: 16
                          }}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            status={isOverloaded ? 'error' : undefined}
                            style={{
                              width: '100%',
                              backgroundColor: isOverloaded
                                ? '#fff1f0'
                                : undefined
                            }}
                            value={getAllocationValue(row, month.value)}
                            onChange={number => {
                              updateAllocation(index, month.value, number);
                            }}
                          />

                          {row.resource && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 11,
                                textAlign: 'left',
                                color: isOverloaded ? '#ff4d4f' : '#607d8b'
                              }}
                            >
                              Total: {Math.round(totalPercent)}%
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td style={{ width: 60 }}>
                      <Popconfirm
                        title="Remove resource?"
                        description="Are you sure to remove this resource?"
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        icon={
                          <QuestionCircleOutlined style={{ color: 'orange' }} />
                        }
                        onConfirm={() => removeRow(index)}
                      >
                        <Button danger type="text" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </td>
                  </tr>

                  {isRowOverloaded(row) && (
                    <tr>
                      <td colSpan={months.length + 2}>
                        <div
                          style={{
                            background: '#fff1f0',
                            border: '1px solid #ffccc7',
                            color: '#ff4d4f',
                            padding: '10px 14px',
                            borderRadius: 6,
                            fontSize: 13
                          }}
                        >
                          <ExclamationCircleOutlined
                            style={{ marginRight: 8 }}
                          />
                          {getResourceName(row.resource)} is overallocated in
                          one or more months. Total workload exceeds 100% when
                          combined with other projects.
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
