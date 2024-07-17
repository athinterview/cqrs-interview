import { Router } from 'express';
import Joi from 'joi';
import { CommandExecutor } from '@/cqrs/command';
import {
  productAddCommand,
  productListQuery,
  productRestockCommand,
  productSellCommand
} from '@/cqrs/products';
import { productSchemaValidator } from '@/schema/product.schema';
import { asyncRoute, methodNotAllowed } from '@/routes/rest-utils';

const productAddValidator = Joi.object({
  name: productSchemaValidator.extract('name'),
  description: productSchemaValidator.extract('description'),
  price: productSchemaValidator.extract('price'),
  stock: productSchemaValidator.extract('stock'),
})

const productAmountValidator = Joi.object({
  amount: Joi.number().required().integer().min(1),
})


export function createProductsRouter(executor: CommandExecutor) {
  const router = Router();

  router
    .get('/', asyncRoute(async function (req, res) {
      res.json(await executor.execute(productListQuery()));
    }));
  router.post('/', async function (req, res) {
    const dto = req.body;
    const { error, value } = productAddValidator.validate(dto);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(await executor.execute(productAddCommand(value)));
  })

  router.all('/', methodNotAllowed('GET', 'POST'));

  router.post('/:id/restock', asyncRoute(async function (req, res) {
    const dto = req.body;
    const id = req.params.id;
    const { error, value } = productAmountValidator.validate(dto);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await executor.execute(productRestockCommand(id, value.amount))
    res.sendStatus(204);
  }));
  router.all('/:id/restock', methodNotAllowed('POST'));

  router.post('/:id/sell', asyncRoute(async function (req, res) {
    const dto = req.body;
    const id = req.params.id;
    const { error, value } = productAmountValidator.validate(dto);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await executor.execute(productSellCommand(id, value.amount));
    res.sendStatus(204);
  }));
  router.all('/:id/sell', methodNotAllowed('POST'));

  return router;
}