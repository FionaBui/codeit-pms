import { Router } from 'express';
import { getSeveraUsers, getSeveraUser } from '../controllers/userController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const userRoutes = Router();

userRoutes.get('/severa', requireAuth, getSeveraUsers);
userRoutes.get('/severa/:id', requireAuth, getSeveraUser);
