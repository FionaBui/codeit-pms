import { listProjects } from '../services/projectService.js';

export async function getProjects(req, res, next) {
  try {
    const projects = await listProjects();
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
}

