import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { connectToDatabase } from '../config/db.js';
import { Project } from '../models/Project.js';
import { Resource } from '../models/Resource.js';
import { ResourceAllocation, normalizeAllocation } from '../models/ResourceAllocation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf-8'));
const resources = JSON.parse(fs.readFileSync(path.join(__dirname, 'resources.json'), 'utf-8'));
const resourceAllocations = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'resourceAllocations.json'), 'utf-8')
);

dotenv.config({ path: path.resolve(process.cwd(), 'apps/pms-api/.env') });

async function seed() {
  console.log('Connecting to database...');
  await connectToDatabase();

  console.log(`Seeding ${projects.length} projects...`);
  const existingProjects = await Project.countDocuments();
  if (existingProjects > 0) {
    console.log(`Found ${existingProjects} existing projects. Deleting before seed...`);
    await Project.deleteMany({});
  }
  const insertedProjects = await Project.insertMany(projects);
  console.log(`Seeded ${insertedProjects.length} projects.`);
  insertedProjects.forEach((p) => console.log(`  - ${p.shortName}: ${p.name}`));

  console.log(`Seeding ${resources.length} resources...`);
  const existingResources = await Resource.countDocuments();
  if (existingResources > 0) {
    console.log(`Found ${existingResources} existing resources. Deleting before seed...`);
    await Resource.deleteMany({});
  }
  const insertedResources = await Resource.insertMany(resources);
  console.log(`Seeded ${insertedResources.length} resources.`);
  insertedResources.forEach((r) =>
    console.log(`  - ${r._id}: ${r.name}${r.title ? ` (${r.title})` : ''}`)
  );

  console.log(`Seeding ${resourceAllocations.length} resource allocation document(s)...`);
  const existingAlloc = await ResourceAllocation.countDocuments();
  if (existingAlloc > 0) {
    console.log(`Found ${existingAlloc} existing resource allocations. Deleting before seed...`);
    await ResourceAllocation.deleteMany({});
  }
  const insertedAlloc = await ResourceAllocation.insertMany(
    resourceAllocations.map((doc) => ({
      ...doc,
      allocation: normalizeAllocation(doc.allocation)
    }))
  );
  console.log(`Seeded ${insertedAlloc.length} resource allocation document(s).`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
