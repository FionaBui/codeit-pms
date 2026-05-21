import {
  listProjects,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService
} from '../services/projectService.js';
import { listProjectsFromSevera, fetchAllProjectsFromSevera } from '../services/severa/severaProjectService.js';

export async function getProjects(req, res, next) {
  try {
    const projects = await listProjects();
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
}

export async function getAllSeveraProjects(req, res, next) {
  try {
    const data = await fetchAllProjectsFromSevera(req.query);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getSeveraProjects(req, res, next) {
  try {
    const { data, nextPageToken } = await listProjectsFromSevera(req.query);

    if (nextPageToken) {
      res.setHeader('NextPageToken', nextPageToken);
    }

    res.status(200).json({ data });
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

export async function deleteProject(req, res, next) {
  try {
    const project = await deleteProjectService(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    res.status(200).json({
      data: project
    });
  } catch (err) {
    next(err);
  }
}
