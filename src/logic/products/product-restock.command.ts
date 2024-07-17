import { CommandExecutor } from '@/cqrs/command';
import { ProductRestockCommand } from '@/cqrs/products';
import { DBType } from '@/schema/db.schema';
import { ObjectNotFoundError, ObjectValidationError } from '@/logic/errors';


export function addProductRestockCommand(executor: CommandExecutor, db: DBType) {
  executor.addHandler<ProductRestockCommand>('product.restock', async (payload) => {
    if (payload.amount < 1) {
      throw new ObjectValidationError(`Invalid stock update value: ${payload.amount}`);
    }

    const product = db.data.products.find((p) => p.id === payload.id);
    if (!product) {
      throw new ObjectNotFoundError(`Product ${payload.id} not found`);
    }

    product.stock += payload.amount;
    await db.write();

    return;
  });
}
