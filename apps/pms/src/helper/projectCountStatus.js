const ALL_TYPES = [
  'Type 1: new development outside Core Services',
  'Type 2: development / improvements inside Core Services',
  'Type 3: Customizations & Change requests',
  'Type 4: Daily support & Continuous improvements'
];

const ALL_STATUSES = ['plan', 'execution', 'closing', 'finished'];

function matchProject(project, selectedType, selectedStatus) {
  const matchType = selectedType ? project.type === selectedType : true;
  const matchStatus = selectedStatus ? project.status === selectedStatus : true;

  return matchType && matchStatus;
}

// Count type
export function getProjectCountByType(projects, selectedStatus = null) {
  if (!Array.isArray(projects)) return [];

  const result = {};

  projects.forEach(p => {
    if (!p.type) return;

    const matchStatus = selectedStatus ? p.status === selectedStatus : true;

    if (!matchStatus) return;

    result[p.type] = (result[p.type] ?? 0) + 1;
  });

  return ALL_TYPES.map(type => ({
    name: type,
    value: result[type] ?? 0
  }));
}

// Total manhours by type
export function getTotalApprovalManhoursByType(
  projects,
  selectedStatus = null
) {
  if (!Array.isArray(projects)) return [];

  const result = {};

  projects.forEach(p => {
    if (!p.type) return;

    const matchStatus = selectedStatus ? p.status === selectedStatus : true;

    if (!matchStatus) return;

    result[p.type] = (result[p.type] ?? 0) + (Number(p.plannedManhours) || 0);
  });

  return ALL_TYPES.map(type => ({
    name: type,
    value: result[type] ?? 0
  }));
}

// Count projects by Status
export function getProjectCountByStatus(
  projects,
  selectedType = null,
  selectedStatus = null
) {
  if (!Array.isArray(projects)) return [];

  return ALL_STATUSES.map(status => {
    const statusProjects = projects.filter(p => p.status === status);
    const total = statusProjects.length;

    const highlighted = selectedType
      ? statusProjects.filter(p => p.type === selectedType).length
      : total;

    return {
      name: status,
      highlighted,
      rest: total - highlighted,
      total,
      isSelected: selectedStatus ? status === selectedStatus : false
    };
  });
}

// Planned vs Actual manhours
export function getPlannedVsActualManhoursByProject(
  projects,
  selectedType = null,
  selectedStatus = null
) {
  if (!Array.isArray(projects)) return [];

  return projects.map(p => {
    const planned = Number(p.plannedManhours) || 0;
    const actual = Number(p.actualManhours) || 0;

    return {
      name: p.name,
      shortName: p.shortName || p.name,
      planned,
      actual,
      isOverrun: actual > planned,
      isHighlighted: matchProject(p, selectedType, selectedStatus)
    };
  });
}
