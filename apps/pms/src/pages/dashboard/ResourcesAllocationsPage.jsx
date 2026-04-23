import { useEffect, useMemo, useState } from 'react';
import { ChartCard } from '@codeit/ui';
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
    <ChartCard height="100vh">
      <ResourcesAllocationsChart
        rows={currentMonthRows}
        currentMonth={currentMonth}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        selectedResource={selectedResource}
      />

      <ResourcesAllocationsThreeMonthsChart
        rows={allRows}
        months={months}
        selectedProject={selectedProject}
        selectedResource={selectedResource}
        onSelectResource={handleSelectResource}
      />
    </ChartCard>
  );
}
