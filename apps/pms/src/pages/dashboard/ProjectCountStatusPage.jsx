import { Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { listProjects } from '../../api/projectApi';
import PlannedActualChart from '../../components/dashboard/PlannedActualChart';
import { ProjectCountStatusBarChart } from '../../components/dashboard/ProjectCountStatusBarChart';
import { ProjectByTypeChart } from '../../components/dashboard/ProjectByTypeChart';

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

  function handleTypeClick(typeName) {
    setSelectedFilter(prev => ({
      projectType: prev.projectType === typeName ? null : typeName,
      status: null
    }));
  }

  function handleStatusClick(statusName) {
    setSelectedFilter(prev => ({
      projectType: null,
      status: prev.status === statusName ? null : statusName
    }));
  }

  return (
    <Space orientation="vertical" size={8} style={{ width: '100%' }}>
      <div>
        <Title level={4} style={{ marginBottom: 4 }}>
          Project Count & Status
        </Title>
      </div>

      <div className="grid grid-cols-[1fr_500px] min-[1800px]:grid-cols-2  gap-2">
        <ProjectByTypeChart
          title="Projects by Type"
          projects={projects}
          onTypeClick={handleTypeClick}
          selectedType={selectedFilter.projectType}
          selectedStatus={selectedFilter.status}
        />

        <PlannedActualChart
          projects={projects}
          selectedType={selectedFilter.projectType}
          selectedStatus={selectedFilter.status}
          className="col-start-2 row-span-3 h-full flex flex-col"
        />

        <ProjectByTypeChart
          title="Approved Manhours by Type"
          projects={projects}
          onTypeClick={handleTypeClick}
          calcKey="plannedManhours"
          labelFormatter={({ name, value, percent }) =>
            `${value?.toLocaleString()} h (${percent?.toFixed(2)}%)`
          }
          selectedType={selectedFilter.projectType}
          selectedStatus={selectedFilter.status}
        />

        <ProjectCountStatusBarChart
          projects={projects}
          selectedType={selectedFilter.projectType}
          onStatusClick={handleStatusClick}
          selectedStatus={selectedFilter.status}
        />
      </div>

      {/* <Row gutter={[8, 8]}>
        <Col xs={24} lg={12}>
          <ProjectByTypeChart
            title="Projects by Type"
            projects={projects}
            onTypeClick={handleTypeClick}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectByTypeChart
            title="Approved Manhours by Type"
            projects={projects}
            onTypeClick={handleTypeClick}
            calcKey="plannedManhours"
            labelFormatter={({ name, value, percent }) =>
              `${value?.toLocaleString()} h (${percent?.toFixed(2)}%)`
            }
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProjectCountStatusBarChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            onStatusClick={handleStatusClick}
            selectedStatus={selectedFilter.status}
          />
        </Col>

        <Col xs={24} lg={12}>
          <PlannedActualChart
            projects={projects}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
          />
        </Col>
      </Row> */}
    </Space>
  );
}
