import { NextFunction, Request, Response } from 'express';

export function tryCatch(
  target: unknown,
  key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await originalMethod.call(this, req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return descriptor;
}
