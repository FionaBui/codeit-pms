import { Card, Col, Row, Space, Typography } from 'antd';
import { useAuth } from '@codeit/auth';
import { useEffect } from 'react';
import { listProjects } from '../../api/projectApi';
import { mockProjects } from '../../mocks/mockProjects';
import {
  buildProjectTypePieOption,
  buildApprovalManhoursPieOption,
} from '../../helper/projectCountStatus';
import { BaseChart, ChartCard } from '@codeit/ui';

const { Title } = Typography;

export default function ProjectCountStatusPage() {
  useEffect(() => {
    listProjects().then((projects) => {
      console.log(projects);
    });
  }, []);
  const projectTypePieOption = buildProjectTypePieOption(mockProjects);
  const approvalManhoursPieOption =
    buildApprovalManhoursPieOption(mockProjects);
  console.log(buildApprovalManhoursPieOption(mockProjects));
  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      {/* Page Header */}
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Project Count & Status
        </Title>
      </div>

      {/* Chart Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ChartCard title="Projects by Type">
            <BaseChart option={projectTypePieOption} />
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="Approved Manhours by Type">
            <BaseChart option={approvalManhoursPieOption} />
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Project Count by Status">
            <div style={{ height: 450 }}>Chart 3</div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Planned vs Actual Manhours">
            <div style={{ height: 450 }}>Chart 4</div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
