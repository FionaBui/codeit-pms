import { dayjs } from '@codeit/utils';
import { ResourceAllocation } from '../models/ResourceAllocation.js';

export async function findResourceAllocationForNextMonths(
  currentMonth,
  months = 1
) {
  const start = dayjs.utc(currentMonth);
  const end = start.add(months - 1, 'month');

  return await ResourceAllocation.aggregate([
    {
      $match: {
        allocation: {
          $elemMatch: {
            month: { $gte: start.toDate(), $lte: end.toDate() }
          }
        }
      }
    },
    {
      $project: {
        resource: 1,
        project: 1,
        allocation: {
          $filter: {
            input: '$allocation',
            as: 'item',
            cond: {
              $and: [
                { $gte: ['$$item.month', start.toDate()] },
                { $lte: ['$$item.month', end.toDate()] }
              ]
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'resource',
        foreignField: '_id',
        as: 'resource'
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'project',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$resource'
    },
    {
      $unwind: '$project'
    },
    {
      $project: {
        resource: '$resource.name',
        project: '$project.name',
        allocation: '$allocation'
      }
    }
  ]);
}

export async function findResourceAllocationsByProject(projectId) {
  return await ResourceAllocation.aggregate([
    {
      $match: {
        project: projectId
      }
    },
    {
      $project: {
        resource: 1,
        project: 1,
        allocation: 1
      }
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'resource',
        foreignField: '_id',
        as: 'resource'
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'project',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$resource'
    },
    {
      $unwind: '$project'
    },
    {
      $project: {
        resourceId: '$resource._id',
        resource: '$resource.name',
        projectId: '$project._id',
        project: '$project.name',
        allocation: '$allocation'
      }
    }
  ]);
}

export async function saveResourceAllocationsForProject(projectId, resources) {
  const savedAllocations = [];

  const resourceIds = resources
    .filter(resourceRow => resourceRow.resource)
    .map(resourceRow => resourceRow.resource);

  await ResourceAllocation.deleteMany({
    project: projectId,
    resource: { $nin: resourceIds }
  });

  for (const resourceRow of resources) {
    if (!resourceRow.resource) continue;

    const allocation = (resourceRow.allocation || []).map(monthItem => ({
      month: dayjs.utc(monthItem.month).startOf('month').toDate(),
      percent: Number(monthItem.percent || 0) / 100
    }));

    const saved = await ResourceAllocation.findOneAndUpdate(
      {
        project: projectId,
        resource: resourceRow.resource
      },
      {
        project: projectId,
        resource: resourceRow.resource,
        allocation
      },
      {
        new: true,
        upsert: true
      }
    );

    savedAllocations.push(saved);
  }

  return savedAllocations;
}
