import { Router } from 'express';
import Joi from 'joi';
import { CommandExecutor } from '@/cqrs/command';
import { orderPlaceCommand } from '@/cqrs/orders';
import { asyncRoute, methodNotAllowed } from './rest-utils';


const orderPlaceValidator = Joi.object({
  customerId: Joi.string().required(),
  products: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    amount: Joi.number().required().integer().min(1),
  })).min(1).required(),
});

export function createOrdersRouter(executor: CommandExecutor) {
  const router = Router();

  router.post('/', asyncRoute(async function (req, res) {
    const dto = req.body;
    const { error, value } = orderPlaceValidator.validate(dto);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(await executor.execute(orderPlaceCommand(value)));
  }))

  router.all('/', methodNotAllowed('POST'));

  return router;
}
