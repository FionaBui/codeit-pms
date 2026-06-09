import { Router } from 'express';
import { getMenus } from '../controllers/menuController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const menuRoutes = Router();

menuRoutes.get('/', requireAuth, getMenus);
