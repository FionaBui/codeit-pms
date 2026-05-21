import { Project } from '../models/Project.js';
import { severaFetch } from '../services/severa/severaClient.js';
import { listProjectsFromSevera } from '../services/severa/severaProjectService.js';

const WORKER_NAME = 'syncActualHours';

/**
 * Fetches all workhour pages for a Severa project GUID and returns
 * the total sum of `quantity` (hours).
 *
 * @param {string} severaGuid - Severa project guid (looked up via project number)
 * @returns {Promise<number|null>}
 */
async function fetchTotalHours(severaGuid) {
  let total = 0;
  let pageToken = null;

  do {
    const query = pageToken
      ? `?pageToken=${encodeURIComponent(pageToken)}`
      : '';
    const res = await severaFetch(
      `/projects/${encodeURIComponent(severaGuid)}/workhours${query}`
    );

    if (res.status === 404) {
      console.warn(
        `[${WORKER_NAME}] Severa project ${severaGuid} not found — skipping.`
      );
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Severa workhours error (${res.status}): ${text}`);
    }

    const workhours = await res.json();
    for (const wh of workhours) {
      total += wh.quantity ?? 0;
    }

    pageToken = res.headers.get('NextPageToken') ?? null;
  } while (pageToken);

  return total;
}

/**
 * Syncs actualManhours for all local projects that have a `number` matching
 * a Severa project number.
 */
export async function syncActualHours() {
  console.log(`[${WORKER_NAME}] Starting sync...`);
  const startedAt = Date.now();

  // Step 1: get all project numbers from MongoDB
  const projects = await Project.find(
    { number: { $exists: true, $ne: null } },
    { _id: 1, name: 1, number: 1 }
  ).lean();

  if (projects.length === 0) {
    console.log(
      `[${WORKER_NAME}] No local projects with a number — nothing to sync.`
    );
    return;
  }

  // Step 2: fetch only matching projects from Severa using those numbers
  const numbers = projects.map(p => p.number);
  const { data: severaProjects } = await listProjectsFromSevera({ numbers });

  console.log(severaProjects.length);

  const numberToGuid = new Map(
    severaProjects
      .filter(p => p.number != null && p.guid)
      .map(p => [Number(p.number), p.guid])
  );

  console.log(
    `[${WORKER_NAME}] Matched ${numberToGuid.size}/${projects.length} project(s) in Severa.`
  );

  console.log(`[${WORKER_NAME}] Syncing ${projects.length} project(s)...`);

  const BATCH_SIZE = 5;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    const batch = projects.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async project => {
        const severaGuid = numberToGuid.get(Number(project.number));

        if (!severaGuid) {
          console.warn(
            `[${WORKER_NAME}] No Severa match for project number ${project.number} ("${project.name}") — skipping.`
          );
          failed++;
          return;
        }

        try {
          const totalHours = await fetchTotalHours(severaGuid);

          if (totalHours === null) {
            failed++;
            return;
          }

          await Project.updateOne(
            { _id: project._id },
            { $set: { actualManhours: totalHours, updatedBy: WORKER_NAME } }
          );

          console.log(
            `[${WORKER_NAME}] ${project.name} (#${project.number}): ${totalHours}h`
          );
          updated++;
        } catch (err) {
          failed++;
          console.error(
            `[${WORKER_NAME}] Failed to sync "${project.name}" (#${project.number}):`,
            err.message
          );
        }
      })
    );
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[${WORKER_NAME}] Done — ${updated} updated, ${failed} failed (${elapsed}s).`
  );
}
