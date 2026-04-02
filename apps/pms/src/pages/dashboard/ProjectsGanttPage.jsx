import { useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import { listProjects } from '../../api/projectApi';
import ProjectsGanttChart from '../../components/dashboard/ProjectsGanttChart';
const { Title } = Typography;

export default function ProjectsGanttPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    listProjects().then(response => {
      setProjects(response.data);
    });
  }, []);
  return (
    <Row
      gutter={[16, 16]}
      style={{ minHeight: 'calc(100vh - 100px)' }}
      align="middle"
    >
      <Col span={24}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Projects Gantt
        </Title>
      </Col>
      <Col span={24}>
        <ProjectsGanttChart projects={projects} />
      </Col>
    </Row>
  );
}
