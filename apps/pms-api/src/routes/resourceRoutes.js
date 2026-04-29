import { Router } from 'express';
import { getResources } from '../controllers/resourceController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const resourceRoutes = Router();

resourceRoutes.get('/', requireAuth, getResources);
