import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

function getStatusCode(message: string): number {
  if (message === 'User not found') {
    return 404;
  }
  if (message === 'Email already in use') {
    return 409;
  }
  if (message === 'Invalid credentials') {
    return 401;
  }
  if (
    message === 'Invalid or expired reset token' ||
    message === 'Email is required' ||
    message === 'Tenant is required' ||
    message === 'Token and password are required' ||
    message === 'Tenant, email and password are required' ||
    message === 'Tenant, token and password are required' ||
    message === 'Company name, name, email and password are required'
  ) {
    return 400;
  }
  return 500;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  console.error(err);

  const statusCode = getStatusCode(err.message);

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}
