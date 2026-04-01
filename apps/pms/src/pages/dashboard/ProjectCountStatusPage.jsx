import { Col, Row, Space, Typography } from 'antd';
import { useAuth } from '@codeit/auth';
import { useEffect, useState } from 'react';
import { listProjects } from '../../api/projectApi';

import PlannedActualChart from '../../components/dashboard/PlannedActualChart';
import { ProjectTypePieChart } from '../../components/dashboard/ProjectTypePieChart';
import { ProjectCountStatusBarChart } from '../../components/dashboard/ProjectCountStatusBarChart';
import { ApprovalManhoursPieChart } from '../../components/dashboard/ApprovalManhoursPieChart';

const DEFAULT_LEGEND_SELECTED_TYPE = {
  'Type 1: new development outside Core Services': true,
  'Type 2: development / improvements inside Core Services': true,
  'Type 3: Customizations & Change requests': true,
  'Type 4: Daily support & Continuous improvements': false
};

const DEFAULT_VISIBLE_STATUSES = ['plan', 'execution', 'closing'];

const { Title } = Typography;

export default function ProjectCountStatusPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    listProjects().then(response => {
      setProjects(response.data);
    });
  }, []);

  const [selectedFilter, setSelectedFilter] = useState({
    projectType: null,
    status: null
  });

  const [visibleStatuses, setVisibleStatuses] = useState(
    DEFAULT_VISIBLE_STATUSES
  );

  const [legendSelectedType, setLegendSelectedType] = useState(
    DEFAULT_LEGEND_SELECTED_TYPE
  );

  function handleTypeClick(typeName) {
    setSelectedFilter(prev => ({
      projectType: prev.projectType === typeName ? null : typeName,
      status: null
    }));

    setLegendSelectedType(prev => ({
      ...prev,
      [typeName]: true
    }));
  }

  function handleTypeLegendChange(nextSelectedMap) {
    setLegendSelectedType(nextSelectedMap);
  }

  function handleStatusClick(statusName) {
    setSelectedFilter(prev => ({
      projectType: null,
      status: prev.status === statusName ? null : statusName
    }));
  }

  function handleStatusLegendClick(statusName) {
    setVisibleStatuses(prev => {
      if (prev.includes(statusName)) {
        return prev.filter(status => status !== statusName);
      }

      return [...prev, statusName];
    });
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Project Count & Status
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ProjectTypePieChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
            onTypeClick={handleTypeClick}
            legendSelected={legendSelectedType}
            onLegendChange={handleTypeLegendChange}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ApprovalManhoursPieChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
            onTypeClick={handleTypeClick}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectCountStatusBarChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
            visibleStatuses={visibleStatuses}
            onStatusLegendClick={handleStatusLegendClick}
            onStatusClick={handleStatusClick}
          />
        </Col>

        <Col xs={24} lg={12}>
          <PlannedActualChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
          />
        </Col>
      </Row>
    </Space>
  );
}
