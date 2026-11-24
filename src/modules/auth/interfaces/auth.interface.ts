import { Request } from 'express';
import { AUTH_TOKEN_TYPES } from '../constants/auth.constant.js';

export type AuthTokenType =
  (typeof AUTH_TOKEN_TYPES)[keyof typeof AUTH_TOKEN_TYPES];

export interface AdminJwtPayload {
  sub: string;
  email: string;
  fullName: string;
  isActive: boolean;
  type: typeof AUTH_TOKEN_TYPES.ACCESS | typeof AUTH_TOKEN_TYPES.REFRESH;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
}

export interface AuthenticatedRequest extends Request {
  admin?: AuthenticatedAdmin;
}
