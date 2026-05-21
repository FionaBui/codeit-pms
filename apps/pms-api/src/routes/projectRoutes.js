import { Router } from 'express';
import {
  getProjects,
  getSeveraProjects,
  getAllSeveraProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const projectRoutes = Router();
projectRoutes.get('/', requireAuth, getProjects);
// Severa PSA source — must be registered before /:id
projectRoutes.get('/severa', requireAuth, getSeveraProjects);
projectRoutes.get('/severa/all', requireAuth, getAllSeveraProjects);
// CREATE
projectRoutes.post('/', requireAuth, createProject);
// UPDATE
projectRoutes.put('/:id', requireAuth, updateProject);
// DELETE
projectRoutes.delete('/:id', requireAuth, deleteProject);
