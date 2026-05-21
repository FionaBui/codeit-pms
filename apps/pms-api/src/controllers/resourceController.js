import {
  listResources,
  createResource as createResourceService,
  updateResource as updateResourceService,
  deleteResource as deleteResourceService
} from '../services/resourceService.js';

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

export async function createResource(req, res, next) {
  try {
    const resource = await createResourceService(req.body);

    res.status(201).json({
      data: resource
    });
  } catch (err) {
    next(err);
  }
}

export async function updateResource(req, res, next) {
  try {
    const resource = await updateResourceService(req.params.id, req.body);

    if (!resource) {
      return res.status(404).json({
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      data: resource
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const resource = await deleteResourceService(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      data: resource
    });
  } catch (err) {
    next(err);
  }
}
