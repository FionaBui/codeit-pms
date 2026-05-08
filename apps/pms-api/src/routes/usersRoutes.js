import { Router } from 'express';
import { requireAuth } from '../auth/bearerJwt.js';
import { getTenantUsers } from '../controllers/usersController.js';

export const usersRoutes = Router();

usersRoutes.get('/', requireAuth, getTenantUsers);
