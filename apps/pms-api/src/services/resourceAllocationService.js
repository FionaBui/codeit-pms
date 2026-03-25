import {dayjs} from '@codeit/utils';
import { ResourceAllocation } from "../models/ResourceAllocation.js";

export async function findResourceAllocationForNextMonths(currentMonth, months = 1) {
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
            input: "$allocation",
            as: "item",
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