import { listResources } from '../services/resourceService.js';

export async function getResources(req, res, next) {
  try {
    const resources = await listResources();
    res.status(200).json({
      data: resources
    });
  } catch (err) {
    next(err);
  }
}
