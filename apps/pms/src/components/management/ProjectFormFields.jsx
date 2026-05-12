import { Row, Col, Form, Input, Select, DatePicker, InputNumber } from 'antd';

export default function ProjectFormFields({
  resources = [],
  statusOptions = [],
  typeOptions = [],
  priorityOptions = []
}) {
  const typeSelectOptions = typeOptions.map(type => ({
    label: type,
    value: type
  }));

  const statusSelectOptions = statusOptions.map(status => ({
    label: status,
    value: status
  }));

  const prioritySelectOptions = priorityOptions.map(priority => ({
    label: priority,
    value: priority
  }));

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="name"
          label="Project Name"
          rules={[
            {
              required: true,
              message: 'Please input project name'
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="shortName" label="Short Name">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="type"
          label="Project Type"
          rules={[
            {
              required: true,
              message: 'Please select project type'
            }
          ]}
        >
          <Select options={typeSelectOptions} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="manager"
          label="Manager"
          rules={[
            {
              required: true,
              message: 'Please input project manager'
            }
          ]}
        >
          <Select
            options={resources.map(resource => ({
              label: resource.name,
              value: resource._id
            }))}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[
            {
              required: true,
              message: 'Please input start date'
            }
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[
            {
              required: true,
              message: 'Please input end date'
            }
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="completion" label="Completion %">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: 'Please select project status'
            }
          ]}
        >
          <Select options={statusSelectOptions} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="priority" label="Priority">
          <Select options={prioritySelectOptions} />
        </Form.Item>
      </Col>
    </Row>
  );
}
