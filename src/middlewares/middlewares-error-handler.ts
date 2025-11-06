import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from '../types/http-error';

const errorHandler: ErrorRequestHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err);

  let status = 500;
  let message = 'Error interno del servidor';
  let details;

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({
    error: message,
    ...(details && { details })
  });
};

export default errorHandler;
