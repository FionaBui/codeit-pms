import { Resource } from '../models/Resource.js';

export async function listResources() {
  return await Resource.find({}).sort({ name: 1 });
}
