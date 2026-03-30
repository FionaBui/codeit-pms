const ALL_TYPES = [
  'Type 1: new development outside Core Services',
  'Type 2: development / improvements inside Core Services',
  'Type 3: Customizations & Change requests',
  'Type 4: Daily support & Continuous improvements'
];
const ALL_STATUSES = ['plan', 'execution', 'closing', 'finished'];

// Count type
export function getProjectCountByType(projects) {
  if (!Array.isArray(projects)) return [];
  const result = {};
  projects.forEach(p => {
    if (!p.type) return;
    result[p.type] = (result[p.type] ?? 0) + 1;
  });
  return ALL_TYPES.map(type => ({
    name: type,
    value: result[type] ?? 0
  }));
}

// Total manhours by type
export function getTotalApprovalManhoursByType(projects) {
  const result = {};
  projects.forEach(p => {
    result[p.type] = (result[p.type] ?? 0) + (p.plannedManhours ?? 0);
  });
  return ALL_TYPES.map(type => ({
    name: type,
    value: result[type] ?? 0
  }));
}

// Count projects by Status
export function getProjectCountByStatus(projects, selectedType) {
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
      total
    };
  });
}

// Planned vs Actual manhours
export function getPlannedVsActualManhoursByProject(projects, selectedType) {
  if (!Array.isArray(projects)) return [];

  return projects.map(p => {
    const planned = Number(p.plannedManhours) || 0;
    const actual = Number(p.actualManhours) || 0;
    const isHighlighted = selectedType ? p.type === selectedType : true;

    return {
      name: p.name,
      shortName: p.shortName || p.name,
      planned,
      actual,
      isOverrun: actual > planned,
      isHighlighted
    };
  });
}
