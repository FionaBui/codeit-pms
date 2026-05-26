import { useEffect, useState } from 'react';
import { ContentLayout } from '@codeit/ui';
import { listProjects } from '../../api/projectApi';
import ProjectsGanttChart from '../../components/dashboard/ProjectsGanttChart';

export default function ProjectsGanttPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    listProjects().then(response => {
      setProjects(response);
    });
  }, []);
  return (
    <ContentLayout title="Projects Gantt">
      <ProjectsGanttChart projects={projects} />
    </ContentLayout>
  );
}
