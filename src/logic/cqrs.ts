import { CommandExecutor } from '@/cqrs/command';
import { DBType } from '@/schema/db.schema';
import { addProductAddCommand } from './products/product-add.command';
import { addProductListQuery } from './products/product-list.query';
import { addProductSellCommand } from './products/product-sell.command';
import { addProductRestockCommand } from './products/product-restock.command';
import { addProductPricesAndStockQuery } from './products/product-prices-and-stock.query';
import { addOrderPlaceCommand } from './orders/order-place.command';

export function createCQRS(db: DBType): CommandExecutor {
  const executor = new CommandExecutor();

  // Products.
  addProductAddCommand(executor, db);
  addProductListQuery(executor, db);
  addProductSellCommand(executor, db);
  addProductRestockCommand(executor, db);
  addProductPricesAndStockQuery(executor, db);

  // Orders
  addOrderPlaceCommand(executor, db);

  return executor;
}