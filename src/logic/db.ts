import { JSONFilePreset } from 'lowdb/node';
import { DBSchema, DBType } from '@/schema/db.schema';

export async function createDB(path: string): Promise<DBType> {
  const db = await JSONFilePreset<DBSchema>(path, {
    products: [],
    orders: [],
  });

  return db;
}