import { Card, Col, Row, Space, Typography } from 'antd';
import { useAuth } from '@codeit/auth';
import { useEffect, useState } from 'react';
import { listProjects } from '../../api/projectApi';

import PlannedActualBarChart from '../../components/dashboard/PlannedActualBarChart';
import { ProjectTypePieChart } from '../../components/dashboard/ProjectTypePieChart';
import { ProjectCountStatusBarChart } from '../../components/dashboard/ProjectCountStatusBarChart';
import { ApprovalManhoursPieChart } from '../../components/dashboard/ApprovalManhoursPieChart';
const DEFAULT_LEGEND_SELECTED_TYPE = {
  'Type 1: New Development outside Core Services': true,
  'Type 2: Development/improvements inside Core Services': true,
  'Type 3: Customizations & Change requests': true,
  'Type 4: Daily support & Continuous improvements': false,
};

const { Title } = Typography;

export default function ProjectCountStatusPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    listProjects().then((response) => {
      setProjects(response.data);
    });
  }, []);

  const [selectedFilter, setSelectedFilter] = useState({
    projectType: null,
    status: null,
  });

  function handleTypeClick(typeName) {
    setSelectedFilter((prev) => ({
      projectType: prev.projectType === typeName ? null : typeName,
      status: null,
    }));
  }

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
          <ProjectTypePieChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            onTypeClick={handleTypeClick}
            legendSelected={DEFAULT_LEGEND_SELECTED_TYPE}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ApprovalManhoursPieChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            onTypeClick={handleTypeClick}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectCountStatusBarChart
            projects={projects}
            selectedType={selectedFilter.projectType}
          />
        </Col>

        <Col xs={24} lg={12}>
          <PlannedActualBarChart
            projects={projects}
            selectedType={selectedFilter.projectType}
          />
        </Col>
      </Row>
    </Space>
  );
}
