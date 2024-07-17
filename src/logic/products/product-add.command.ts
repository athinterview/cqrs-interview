import { CommandExecutor } from '@/cqrs/command';
import { ProductAddCommand } from '@/cqrs/products';
import { nanoid } from 'nanoid';
import { productSchemaValidator } from '@/schema/product.schema';
import { DBType } from '@/schema/db.schema';
import { ObjectValidationError } from '@/logic/errors';


export function addProductAddCommand(executor: CommandExecutor, db: DBType) {
  executor.addHandler<ProductAddCommand>('product.add', async (payload) => {
    const product = {
      ...payload,
      id: nanoid(),
    }

    const {error, value} = productSchemaValidator.validate(product);
    if (error) {
      throw new ObjectValidationError(`Invalid product: ${error.message}`);
    }

    db.data.products.push(value);
    await db.write();
    return {id: product.id};
  })
}
