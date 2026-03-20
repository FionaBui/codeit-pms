import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { connectToDatabase } from '../config/db.js';
import { Project } from '../models/Project.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf-8'));

dotenv.config({ path: path.resolve(process.cwd(), 'apps/pms-api/.env') });

async function seed() {
  console.log(`Seeding ${projects.length} projects...`);

  console.log('Connecting to database...');
  await connectToDatabase();

  const existing = await Project.countDocuments();
  if (existing > 0) {
    console.log(`Found ${existing} existing projects. Deleting before seed...`);
    await Project.deleteMany({});
  }

  const inserted = await Project.insertMany(projects);
  console.log(`Seeded ${inserted.length} projects.`);
  inserted.forEach((p) => console.log(`  - ${p.shortName}: ${p.name}`));
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
