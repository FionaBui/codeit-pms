import { Router } from 'express';
import { getProjects } from '../controllers/projectController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const projectRoutes = Router();

projectRoutes.get('/', requireAuth, getProjects);

