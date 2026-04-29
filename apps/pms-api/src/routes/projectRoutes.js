import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject
} from '../controllers/projectController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const projectRoutes = Router();
// GET
projectRoutes.get('/', requireAuth, getProjects);
// CREATE
projectRoutes.post('/', requireAuth, createProject);
// UPDATE
projectRoutes.put('/:id', requireAuth, updateProject);
