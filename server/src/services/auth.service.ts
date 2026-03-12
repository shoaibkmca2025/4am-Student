import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'COMPANY';
}

export interface LoginInput {
  email: string;
  password: string;
}

function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict('Email already in use');

  if (input.password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role,
    },
  });

  if (input.role === 'STUDENT') {
    await prisma.studentProfile.create({ data: { userId: user.id } });
  } else if (input.role === 'COMPANY') {
    await prisma.companyProfile.create({
      data: { userId: user.id, companyName: input.name },
    });
  }

  const tokens = await createTokenPair(user.id, user.role);
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) throw ApiError.unauthorized('Invalid email or password');

  const tokens = await createTokenPair(user.id, user.role);
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  let payload: { userId: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const session = await prisma.session.findUnique({ where: { token: refreshToken } });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    throw ApiError.unauthorized('Refresh token expired or revoked');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw ApiError.unauthorized('User not found');

  // Rotate refresh token
  await prisma.session.delete({ where: { id: session.id } });
  return createTokenPair(user.id, user.role);
}

export async function logout(refreshToken: string) {
  await prisma.session.deleteMany({ where: { token: refreshToken } });
}

async function createTokenPair(userId: string, role: string): Promise<TokenPair> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.internal('User not found');

  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);

  await prisma.session.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return { accessToken, refreshToken };
}
