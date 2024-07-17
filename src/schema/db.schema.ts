import { Low } from 'lowdb';
import { ProductSchema } from '@/schema/product.schema';
import { OrderSchema } from '@/schema/order.schema';

export type DBSchema = {
  products: ProductSchema[];
  orders: OrderSchema[];
}

export type DBType = Low<DBSchema>;