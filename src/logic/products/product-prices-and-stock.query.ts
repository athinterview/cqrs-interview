import { CommandExecutor } from '@/cqrs/command';
import { DBType } from '@/schema/db.schema';
import { ProductPricesAndStockQuery } from '@/cqrs/products';
import { ObjectNotFoundError } from '../errors';


export function addProductPricesAndStockQuery(executor: CommandExecutor, db: DBType) {
  executor.addHandler<ProductPricesAndStockQuery>('product.pricesAndStock', async (payload) => {
    // A set is faster that looking at an array in a loop and will make it easier to check if we have all the items.
    const expectedIds = new Set<string>(payload.ids);
    const requestedProducts = db.data.products.filter(p => expectedIds.has(p.id));

    // Map product to response, keeping only relevant data and remove IDs from the set.
    const result = requestedProducts.map(product => {
      expectedIds.delete(product.id);
      return {
        id: product.id,
        price: product.price,
        stock: product.stock,
      };
    });

    // Make sure nothing is missing.
    if (expectedIds.size > 0) {
      throw new ObjectNotFoundError(`Product(s) not found: ${Array.from(expectedIds.values()).join(', ')}`);
    }

    return {items: result};
  });
}