import { Router } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { projectRoutes } from './projectRoutes.js';
import { resourceAllocationRoutes } from './resourceAllocationRoutes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/resource-allocations', resourceAllocationRoutes);

