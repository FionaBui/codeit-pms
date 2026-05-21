import cron from 'node-cron';
import { syncActualHours } from './syncActualHours.js';

/**
 * Registers and starts all background workers.
 * Call once after the database connection is established.
 */
export function startWorkers() {
  // Run every hour at minute 0  (e.g. 01:00, 02:00, ...)
  // Adjust via SYNC_ACTUAL_HOURS_CRON env var, e.g. "*/30 * * * *" for every 30 min
  const schedule = process.env.SYNC_ACTUAL_HOURS_CRON ?? '0 * * * *';

  cron.schedule(schedule, () => {
    syncActualHours().catch((err) => {
      console.error('[workers] syncActualHours crashed:', err);
    });
  });

  console.log(`[workers] syncActualHours scheduled: "${schedule}"`);

  // Run once immediately on startup so data is fresh without waiting for the first tick
  syncActualHours().catch((err) => {
    console.error('[workers] syncActualHours initial run failed:', err);
  });
}
