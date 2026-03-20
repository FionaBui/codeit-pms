import dotenv from 'dotenv';
import path from 'node:path';
import { createServer } from './server.js';
import { connectToDatabase } from './config/db.js';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/pms-api/.env') });

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function bootstrap() {
  await connectToDatabase();

  const app = createServer();

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
