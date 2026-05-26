import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';
import { dayjs } from '@codeit/utils';
import { ContentLayout, CHART_COLORS } from '@codeit/ui';
import { getResourceAllocationForNextMonths } from '../../api/resourceAllocationApi.js';
import { HeadCountPieChart } from '../../components/dashboard/HeadCountPieChart.jsx';
function getNextThreeMonths() {
  return [0, 1, 2].map(index => {
    const month = dayjs().startOf('month').add(index, 'month');

    return {
      key: month.format('YYYY-MM-DD'),
      label: month.format('MMMM')
    };
  });
}

function formatNumber(value) {
  return Number(value.toFixed(2));
}

function getHeadcountRowsByMonth(resourceAllocations, monthKey) {
  const groupedByProject = {};

  resourceAllocations.forEach(item => {
    const projectName = item.projectName || item.project || 'Unknown project';

    item.allocation?.forEach(allocation => {
      const allocationMonth = dayjs(allocation.month)
        .startOf('month')
        .format('YYYY-MM-DD');

      if (allocationMonth !== monthKey) {
        return;
      }

      const percent = allocation.percent || 0;

      if (!groupedByProject[projectName]) {
        groupedByProject[projectName] = {
          projectName,
          headcount: 0
        };
      }

      groupedByProject[projectName].headcount += percent;
    });
  });

  return Object.values(groupedByProject)
    .filter(item => item.headcount > 0)
    .map(item => ({
      name: item.projectName,
      value: formatNumber(item.headcount)
    }))
    .sort((a, b) => b.value - a.value);
}

export default function HeadcountPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [resourceAllocations, setResourceAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = useMemo(() => getNextThreeMonths(), []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await getResourceAllocationForNextMonths(3);

        setResourceAllocations(data);
      } catch (error) {
        console.error('Failed to load headcount data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const charts = useMemo(() => {
    return months.map(month => ({
      ...month,
      data: getHeadcountRowsByMonth(resourceAllocations, month.key)
    }));
  }, [months, resourceAllocations]);

  const projectColorMap = useMemo(() => {
    const projectNames = [];

    charts.forEach(chart => {
      chart.data.forEach(item => {
        if (!projectNames.includes(item.name)) {
          projectNames.push(item.name);
        }
      });
    });

    return projectNames.reduce((map, projectName, index) => {
      map[projectName] = CHART_COLORS[index % CHART_COLORS.length];
      return map;
    }, {});
  }, [charts]);

  if (loading) {
    return (
      <ContentLayout title="Headcounts 3 months planning">
        <Spin />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Headcounts 3 months planning">
      <div className="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden">
        {charts.map(chart => (
          <HeadCountPieChart
            key={chart.key}
            title={chart.label}
            data={chart.data}
            className="min-h-0 flex-1"
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            projectColorMap={projectColorMap}
          />
        ))}
      </div>
    </ContentLayout>
  );
}
