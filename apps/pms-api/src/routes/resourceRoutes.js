import { Router } from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const resourceRoutes = Router();

resourceRoutes.get('/', requireAuth, getResources);
resourceRoutes.post('/', requireAuth, createResource);
resourceRoutes.put('/:id', requireAuth, updateResource);
resourceRoutes.delete('/:id', requireAuth, deleteResource);
