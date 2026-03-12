import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { ApiError } from '../utils/ApiError';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };
}
