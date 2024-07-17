import Joi from 'joi';
import { decimalNonZeroPositiveRequiredField } from '@/schema/utils';

export type ProductSchema = {
  id: string
  name: string;
  description: string;
  price: string;
  stock: number;
}

export const productSchemaValidator = Joi.object<ProductSchema>({
  id: Joi.string().required(),
  name: Joi.string().required().max(50),
  description: Joi.string().required().max(50),
  price: decimalNonZeroPositiveRequiredField(),
  stock: Joi.number().required().min(0),
})
