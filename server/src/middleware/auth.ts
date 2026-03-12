import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
