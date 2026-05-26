import { useEffect, useMemo, useState } from 'react';
import { ContentLayout } from '@codeit/ui';
import { getResourceAllocationForNextMonths } from '../../api/resourceAllocationApi.js';

import ResourcesAllocationsChart from '../../components/dashboard/ResourcesAllocationsChart.jsx';
import ResourcesAllocationsThreeMonthsChart from '../../components/dashboard/ResourcesAllocationsThreeMonthsChart.jsx';
import {
  getAllocationRowsForMonths,
  getCurrentMonthRows,
  getMonthStart,
  getNextThreeMonths
} from '../../helper/resourceAllocation.js';

export default function ResourcesAllocationsPage() {
  const [allRows, setAllRows] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const currentMonth = getMonthStart(0);
  const months = useMemo(() => getNextThreeMonths(), []);

  useEffect(() => {
    getResourceAllocationForNextMonths(3).then(resourceAllocations => {
      const groupedRows = getAllocationRowsForMonths(
        resourceAllocations,
        months
      );

      setAllRows(groupedRows);
    });
  }, [months]);

  const handleSelectProject = project => {
    setSelectedProject(prev => (prev === project ? null : project));
    setSelectedResource(null);
  };

  const handleSelectResource = resource => {
    setSelectedResource(prev => (prev === resource ? null : resource));
    setSelectedProject(null);
  };

  const currentMonthRows = useMemo(() => {
    return getCurrentMonthRows(allRows, currentMonth);
  }, [allRows, currentMonth]);

  return (
    <ContentLayout title="Resources Allocations">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <ResourcesAllocationsChart
          rows={currentMonthRows}
          currentMonth={currentMonth}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          selectedResource={selectedResource}
          className="min-h-0 flex-1"
        />

        <ResourcesAllocationsThreeMonthsChart
          rows={allRows}
          months={months}
          selectedProject={selectedProject}
          selectedResource={selectedResource}
          onSelectResource={handleSelectResource}
          className="min-h-0 flex-1"
        />
      </div>
    </ContentLayout>
  );
}
