import { Row, Col, Form, Input, Select, DatePicker, InputNumber } from 'antd';

export default function ProjectFormFields({
  resources = [],
  statusOptions = [],
  typeOptions = []
}) {
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
        <Form.Item name="type" label="Project Type">
          <Select options={typeOptions} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="manager" label="Manager">
          <Select
            options={resources.map(resource => ({
              label: resource.name,
              value: resource._id
            }))}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="startDate" label="Start Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="endDate" label="End Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="completion" label="Completion %">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="status" label="Status">
          <Select options={statusOptions} />
        </Form.Item>
      </Col>
    </Row>
  );
}
