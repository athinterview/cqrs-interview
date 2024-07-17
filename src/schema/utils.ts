import Decimal from 'decimal.js';
import Joi from 'joi';

export const decimalPositivePattern = /^\d+(\.\d+)?$/;
export const decimalNonZeroPositiveValidator = (value: string) => {
  const dec = new Decimal(value);
  if (dec.lte(0)) {
    throw new Error('must be greater than 0');
  }
  return dec.toFixed(2);
}

export const decimalNonZeroPositiveRequiredField = () => Joi
  .string()
  .required()
  .pattern(decimalPositivePattern)
  .custom(decimalNonZeroPositiveValidator, 'Decimal validation')