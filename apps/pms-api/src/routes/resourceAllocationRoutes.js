import { Router } from 'express';
import { getResourceAllocationForNextMonths } from '../controllers/resourceAllocationController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const resourceAllocationRoutes = Router();

resourceAllocationRoutes.get('/next-months', requireAuth, getResourceAllocationForNextMonths);