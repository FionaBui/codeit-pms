import mongoose from 'mongoose';
import { getEnv } from '@codeit/utils';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const uri = getEnv('MONGODB_URI');

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
  });

  return mongoose.connection;
}

