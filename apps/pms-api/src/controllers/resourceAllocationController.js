import { findResourceAllocationForNextMonths } from "../services/resourceAllocationService.js";

export async function getResourceAllocationForNextMonths(req, res, next) {
  try {
    const { currentMonth, months } = req.query;
    const resourceAllocation = await findResourceAllocationForNextMonths(currentMonth, months);

    res.status(200).json(resourceAllocation);
  } catch (err) {
    next(err);
  }
}