import { Project } from '../models/Project.js';
import '../models/Resource.js';

export async function listProjects() {
  return await Project.find({}).populate('manager');
}
