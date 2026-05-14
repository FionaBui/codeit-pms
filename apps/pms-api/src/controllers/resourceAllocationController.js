import {
  findResourceAllocationForNextMonths,
  findResourceAllocationsByProject,
  saveResourceAllocationsForProject
} from '../services/resourceAllocationService.js';

export async function getResourceAllocationForNextMonths(req, res, next) {
  try {
    const { currentMonth, months } = req.query;

    const resourceAllocation = await findResourceAllocationForNextMonths(
      currentMonth,
      months
    );

    res.status(200).json(resourceAllocation);
  } catch (err) {
    next(err);
  }
}

export async function getResourceAllocationsByProject(req, res, next) {
  try {
    const allocations = await findResourceAllocationsByProject(
      req.params.projectId
    );

    res.status(200).json({
      data: allocations
    });
  } catch (err) {
    next(err);
  }
}

export async function saveResourceAllocationsByProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const { resources } = req.body;

    const savedAllocations = await saveResourceAllocationsForProject(
      projectId,
      resources || []
    );

    res.status(200).json({
      data: savedAllocations
    });
  } catch (err) {
    next(err);
  }
}
