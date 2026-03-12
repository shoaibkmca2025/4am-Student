import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'COMPANY']),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as z.infer<typeof registerSchema>;
    const result = await authService.register(input);
    res.status(201).json(ApiResponse.created(result, 'Registration successful'));
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as z.infer<typeof loginSchema>;
    const result = await authService.login(input);
    res.status(200).json(ApiResponse.ok(result, 'Login successful'));
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw ApiError.badRequest('Refresh token required');
    const tokens = await authService.refresh(refreshToken);
    res.status(200).json(ApiResponse.ok(tokens, 'Token refreshed'));
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.status(200).json(ApiResponse.ok(null, 'Logged out successfully'));
  } catch (err) {
    next(err);
  }
}
