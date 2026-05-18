import { Project } from '../models/Project.js';
import '../models/Resource.js';
import { ResourceAllocation } from '../models/ResourceAllocation.js';

export async function listProjects() {
  return await Project.find({}).populate('manager');
}

export async function createProject(projectData) {
  const project = {
    ...projectData,
    actualManhours: projectData.actualManhours ?? 0,
    completion: projectData.completion ?? 0,
    priority: projectData.priority ?? 'low',
    createdBy: projectData.createdBy ?? 'seed',
    updatedBy: projectData.updatedBy ?? 'seed'
  };

  return await Project.create(project);
}

export async function updateProject(id, projectData) {
  return await Project.findByIdAndUpdate(
    id,
    {
      ...projectData,
      updatedBy: projectData.updatedBy ?? 'frontend'
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('manager');
}

export async function deleteProject(id) {
  const deletedProject = await Project.findOneAndDelete({
    _id: id
  });

  if (!deletedProject) {
    return null;
  }

  await ResourceAllocation.deleteMany({
    project: id
  });

  return deletedProject;
}
