import { useEffect, useState } from 'react';
import { ContentLayout } from '@codeit/ui';
import { listProjects } from '../../api/projectApi';
import PlannedActualChart from '../../components/dashboard/PlannedActualChart';
import { ProjectCountStatusBarChart } from '../../components/dashboard/ProjectCountStatusBarChart';
import { ProjectByTypeChart } from '../../components/dashboard/ProjectByTypeChart';

export default function ProjectCountStatusPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    listProjects().then(response => {
      setProjects(response);
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
    <ContentLayout title="Project Count & Status">
      <div className="grid h-full min-h-[616px] grid-cols-[minmax(0,1fr)_500px] gap-2 min-[1800px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid h-full min-h-[616px] min-w-0 grid-rows-[repeat(3,minmax(200px,1fr))] gap-2">
          <ProjectByTypeChart
            title="Projects by Type"
            projects={projects}
            onTypeClick={handleTypeClick}
            selectedType={selectedFilter.projectType}
            selectedStatus={selectedFilter.status}
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

        <PlannedActualChart
          projects={projects}
          selectedType={selectedFilter.projectType}
          selectedStatus={selectedFilter.status}
          className="min-h-[616px]"
        />
      </div>
    </ContentLayout>
  );
}
