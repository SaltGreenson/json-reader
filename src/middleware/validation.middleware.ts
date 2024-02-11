import { Response, NextFunction } from 'express';
import { Schema } from 'joi';
import ValidationError from '../../config/error';

/**
 * Schema validation
 * @param schema - joi schema
 * @param fieldToValidate
 * @return middleware
 */
export const validateBySchema = (schema: Schema, fieldToValidate = 'body') => {
  return (req: Record<any, any>, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[fieldToValidate], {
      stripUnknown: true,
    });

    if (error) {
      const { details } = error;
      const message = details.map((detail) => detail.message).join(',');
      throw new ValidationError(message, 'VALIDATION_ERROR', 400);
    }

    next();
  };
};
