import { Resource } from '../models/Resource.js';
import { ResourceAllocation } from '../models/ResourceAllocation.js';

export async function listResources() {
  return await Resource.find({}).sort({ name: 1 });
}

export async function createResource(resourceData) {
  const resource = {
    ...resourceData,
    createdBy: resourceData.createdBy ?? 'frontend',
    updatedBy: resourceData.updatedBy ?? 'frontend'
  };

  console.log('resource: ', resource);

  return await Resource.create(resource);
}

export async function updateResource(id, resourceData) {
  return await Resource.findByIdAndUpdate(
    id,
    {
      ...resourceData,
      updatedBy: resourceData.updatedBy ?? 'frontend'
    },
    {
      new: true,
      runValidators: true
    }
  );
}

export async function deleteResource(id) {
  const deletedResource = await Resource.findOneAndDelete({
    _id: id
  });

  if (!deletedResource) {
    return null;
  }

  await ResourceAllocation.deleteMany({
    resource: id
  });

  return deletedResource;
}
