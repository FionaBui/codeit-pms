function matchProject(project, selectedType, selectedStatus) {
  const matchType = selectedType ? project.type === selectedType : true;
  const matchStatus = selectedStatus ? project.status === selectedStatus : true;

  return matchType && matchStatus;
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
