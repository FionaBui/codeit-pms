import {
  listProjects,
  createProject as createProjectService,
  updateProject as updateProjectService
} from '../services/projectService.js';

export async function getProjects(req, res, next) {
  try {
    const projects = await listProjects();
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await createProjectService(req.body);

    res.status(201).json({
      data: project
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await updateProjectService(req.params.id, req.body);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ data: project });
  } catch (err) {
    next(err);
  }
}
