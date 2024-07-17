import { CommandExecutor } from '@/cqrs/command';
import { ProductSellCommand } from '@/cqrs/products';
import { DBType } from '@/schema/db.schema';
import { ObjectDataError, ObjectNotFoundError, ObjectValidationError } from '@/logic/errors';


export function addProductSellCommand(executor: CommandExecutor, db: DBType) {
  executor.addHandler<ProductSellCommand>('product.sell', async (payload) => {
    if (payload.amount < 1) {
      throw new ObjectValidationError(`Invalid stock update value: ${payload.amount}`);
    }

    const product = db.data.products.find((p) => p.id === payload.id);
    if (!product) {
      throw new ObjectNotFoundError(`Product ${payload.id} not found`);
    }

    const newStock = product.stock - payload.amount;
    if (newStock < 0) {
      throw new ObjectDataError(`Product ${payload.id} stock would be negative ${newStock}`);
    }

    product.stock = newStock;
    await db.write();

    return;
  });
}
