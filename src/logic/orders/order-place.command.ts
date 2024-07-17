import { CommandExecutor } from '@/cqrs/command';
import { DBType } from '@/schema/db.schema';
import { OrderPlaceCommand, OrderPlacePayload, OrderPlaceProduct } from '@/cqrs/orders';
import { nanoid } from 'nanoid';
import { OrderSchema, orderSchemaValidator } from '@/schema/order.schema';
import {
  ProductPriceAndStockItem,
  productPricesAndStockQuery,
  productRestockCommand,
  productSellCommand
} from '@/cqrs/products';
import { ObjectDataError, ObjectValidationError } from '@/logic/errors';
import Decimal from 'decimal.js';

export function addOrderPlaceCommand(executor: CommandExecutor, db: DBType) {

  /** Rollback sold products */
  const rollbackSales = async (rollbackStocks: OrderPlaceProduct[]) => {
    for(const product of rollbackStocks) {
      try {
        await executor.execute(productRestockCommand(product.id, product.amount));
      } catch (e){
        console.error(`Failed to recover product stock ${product.id} of ${product.amount}: ${e.message}`);
      }
    }
  };

  /** Sell products and store the sold items */
  const sellProducts = async (products: ProductPriceAndStockItem[], orderProducts: Map<string, OrderPlaceProduct>, soldItems: OrderPlaceProduct[]) => {
    for (const product of products) {
      const orderProduct = orderProducts.get(product.id);

      // Try to sell the product.
      await executor.execute(productSellCommand(product.id, orderProduct.amount))
        .catch(error => {
          console.error(`Failed to sell ${orderProduct.amount} of ${product.id}: ${error.message}`);
          throw error;
        });

      // Store the product we sold, so we can roll back in case of errors.
      soldItems.push({
        id: product.id,
        amount: orderProduct.amount,
      });
    }
  }

  const mapOrder = (orderId: string, payload: OrderPlacePayload, requestedProductsMap: Map<string, ProductPriceAndStockItem>) => {
    let total = new Decimal(0);
    const order: OrderSchema = {
      id: orderId,
      customerId: payload.customerId,
      products: payload.products.map(productOrder => {
        const unitPrice = requestedProductsMap.get(productOrder.id).price;
        const subtotal = new Decimal(unitPrice).mul(productOrder.amount);

        total = total.add(subtotal);

        return {
          id: productOrder.id,
          amount: productOrder.amount,
          subtotal: subtotal.toFixed(2),
        };
      }),
      total: '',
    };

    order.total = total.toFixed(2);

    return order;
  }

  executor.addHandler<OrderPlaceCommand>('order.place', async (payload) => {
    const orderId = nanoid();

    const productIds: string[] = [];
    const orderProducts = new Map<string, OrderPlaceProduct>();

    payload.products.forEach(product => {
      if (orderProducts.has(product.id)) {
        throw new ObjectValidationError(`Product ${product.id} is duplicated in the order`);
      }

      productIds.push(product.id);
      orderProducts.set(product.id, product);
    });

    // Get products we want to order.
    const requestedProducts = await executor.execute(productPricesAndStockQuery(productIds));
    const requestedProductsMap = new Map<string, ProductPriceAndStockItem>();

    // Check if we have all the products in stock.
    requestedProducts.items.forEach(product => {
      const orderProduct = orderProducts.get(product.id);
      if (orderProduct.amount > product.stock) {
        throw new ObjectDataError(`Not enough stock for product ${product.id}`);
      }

      requestedProductsMap.set(product.id, product);
    });

    // Holds the products we sold.
    const soldItems: OrderPlaceProduct[] = [];

    try {
      // Order the products.
      await sellProducts(requestedProducts.items, orderProducts, soldItems);

      const order = mapOrder(orderId, payload, requestedProductsMap);
      const { error } = orderSchemaValidator.validate(order);
      if (error) {
        throw new ObjectDataError(`Invalid order: ${error.message}`);
      }

      db.data.orders.push(order);
      await db.write();

      return {
        id: order.id,
      };
    } catch (e) {
      // Rollback sales if something went wrong after we started selling.
      if (soldItems.length > 0) {
        await rollbackSales(soldItems).catch(rollbackError => {
          console.error(`Failed to rollback: ${rollbackError.message}`);
        });
      }

      throw e;
    }
  });
}