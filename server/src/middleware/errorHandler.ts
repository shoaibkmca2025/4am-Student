import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return res.status(500).json(ApiResponse.error(message));
}
