import Joi from 'joi';
import { decimalNonZeroPositiveRequiredField } from '@/schema/utils';

export type OrderProductSchema = {
  id: string;
  amount: number;
  subtotal: string;
}

export type OrderSchema = {
  id: string;
  customerId: string;
  products: OrderProductSchema[];
  total: string;
}

export const orderProductSchemaValidator = Joi.object<OrderProductSchema>({
  id: Joi.string().required(),
  amount: Joi.number().required().integer().min(1),
  subtotal: decimalNonZeroPositiveRequiredField(),
})

export const orderSchemaValidator = Joi.object<OrderSchema>({
  id: Joi.string().required(),
  customerId: Joi.string().required(),
  products: Joi.array().items(orderProductSchemaValidator).min(1).required(),
  total: decimalNonZeroPositiveRequiredField(),
})