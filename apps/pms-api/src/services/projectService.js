import { Project } from '../models/Project.js';

export async function listProjects() {
  return await Project.find({});
}
