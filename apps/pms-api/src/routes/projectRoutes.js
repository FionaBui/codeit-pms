import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const projectRoutes = Router();
projectRoutes.get('/', requireAuth, getProjects);
// CREATE
projectRoutes.post('/', requireAuth, createProject);
// UPDATE
projectRoutes.put('/:id', requireAuth, updateProject);
// DELETE
projectRoutes.delete('/:id', requireAuth, deleteProject);
