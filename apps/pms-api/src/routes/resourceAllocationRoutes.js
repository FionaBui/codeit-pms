import { Router } from 'express';
import {
  getResourceAllocationForNextMonths,
  getResourceAllocationsByProject,
  saveResourceAllocationsByProject
} from '../controllers/resourceAllocationController.js';
import { requireAuth } from '../auth/bearerJwt.js';

export const resourceAllocationRoutes = Router();

resourceAllocationRoutes.get(
  '/next-months',
  requireAuth,
  getResourceAllocationForNextMonths
);

resourceAllocationRoutes.get(
  '/project/:projectId',
  requireAuth,
  getResourceAllocationsByProject
);

resourceAllocationRoutes.put(
  '/project/:projectId',
  requireAuth,
  saveResourceAllocationsByProject
);
