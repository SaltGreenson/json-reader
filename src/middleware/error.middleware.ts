import { Request, Response, NextFunction } from 'express';
import { IError } from '../../interfaces/IError';

/**
 * Error handler middleware
 * @param error
 * @param _req
 * @param res
 * @param next
 */
export const errorHandlerMiddleware = (
  error: IError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const status_code = error.status_code || 400;
  const message = error.message;
  const fields = !error.fields ? null : error.fields;

  res.status(status_code).json({
    status: false,
    error_code: status_code,
    message,
    fields,
  });

  next();
};
