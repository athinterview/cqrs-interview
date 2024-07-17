import { Command } from './command';

// Note: I'm not using Pick or Omit from ProductSchema, as in real life DTOs and DB schemas
// drift apart very fast.

export type ProductAddPayload = {
  name: string;
  description: string;
  price: string;
  stock: number;
}

export type ProductAddResult = {
  id: string;
}

export type ProductListResponse = {
  items: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
  }[];
}

export type ProductStockUpdatePayload = {
  id: string;
  amount: number;
}

export type ProductPricesAndStockPayload = {
  ids: string[];
}

export type ProductPriceAndStockItem = {
  id: string;
  price: string;
  stock: number;
}

export type ProductPricesAndStockResponse = {
  items: ProductPriceAndStockItem[];
}

export type ProductAddCommand = Command<'product.add', ProductAddPayload, ProductAddResult>;
export type ProductListQuery = Command<'product.list', void, ProductListResponse>
export type ProductRestockCommand = Command<'product.restock', ProductStockUpdatePayload, void>
export type ProductSellCommand = Command<'product.sell', ProductStockUpdatePayload, void>
export type ProductPricesAndStockQuery = Command<'product.pricesAndStock', ProductPricesAndStockPayload, ProductPricesAndStockResponse>

export function productAddCommand(payload: ProductAddPayload): ProductAddCommand {
  return {
    type: 'product.add',
    payload
  }
}

export function productListQuery(): ProductListQuery {
  return {
    type: 'product.list',
    payload: null,
  };
}

export function productRestockCommand(id: string, amount: number): ProductRestockCommand {
  return {
    type: 'product.restock',
    payload: {
      id,
      amount,
    }
  };
}

export function productSellCommand(id: string, amount: number): ProductSellCommand {
  return {
    type: 'product.sell',
    payload: {
      id,
      amount,
    }
  };
}

export function productPricesAndStockQuery(ids: string[]): ProductPricesAndStockQuery {
  return {
    type: 'product.pricesAndStock',
    payload: {
      ids
    },
  };
}