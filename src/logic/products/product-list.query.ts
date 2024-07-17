import { CommandExecutor } from '@/cqrs/command';
import { ProductListQuery } from '@/cqrs/products';
import { DBType } from '@/schema/db.schema';

export function addProductListQuery(executor: CommandExecutor, db: DBType) {
  executor.addHandler<ProductListQuery>('product.list', async () => {
    return {
      items: db.data.products.map((product) => ({
        ...product,
      }))
    };
  });
}