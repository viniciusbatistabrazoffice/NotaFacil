import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

function getStatusCode(message: string): number {
  if (
    message === 'User not found' ||
    message === 'Order not found' ||
    message === 'Financial transaction not found' ||
    message === 'Supplier not found'
  ) {
    return 404;
  }
  if (message === 'Email already in use' || message === 'Supplier document already in use') {
    return 409;
  }
  if (message === 'Invalid credentials') {
    return 401;
  }
  if (
    message === 'Cannot delete your own account' ||
    message === 'Use an email already registered in this company' ||
    message === 'Invalid order status' ||
    message === 'Invalid order id' ||
    message === 'Invalid financial transaction type' ||
    message === 'Invalid financial transaction status' ||
    message === 'Description, category and type are required' ||
    message === 'Amount must be greater than zero' ||
    message === 'All supplier fields are required' ||
    message === 'Supplier state must have 2 characters' ||
    message === 'Invalid or expired reset token' ||
    message === 'Email is required' ||
    message === 'Token and password are required' ||
    message === 'Email and password are required' ||
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
  const statusCode = getStatusCode(err.message);

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}
