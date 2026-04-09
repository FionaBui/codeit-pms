import { Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { listProjects } from '../../api/projectApi';
import PlannedActualChart from '../../components/dashboard/PlannedActualChart';
import { ProjectCountStatusBarChart } from '../../components/dashboard/ProjectCountStatusBarChart';
import { ProjectByTypeChart } from '../../components/dashboard/ProjectByTypeChart';

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

    // setLegendSelectedType(prev => ({
    //   ...prev,
    //   [typeName]: true
    // }));
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
          <ProjectByTypeChart
            title="Projects by Type"
            projects={projects}
            onTypeClick={handleTypeClick}
            selectedType={selectedFilter.projectType}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectByTypeChart
            title="Approved Manhours by Type"
            projects={projects}
            onTypeClick={handleTypeClick}
            accKey="plannedManhours"
            labelFormatter={params => {
              const shortName = params.name.split(':')[0];
              return `${shortName}: ${params.value?.toLocaleString()} h (${params.percent}%)`;
            }}
            selectedType={selectedFilter.projectType}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectCountStatusBarChart
            projects={projects}
            selectedType={selectedFilter.projectType}
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
