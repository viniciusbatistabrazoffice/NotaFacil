import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      tenantId?: string;
      tenantSchema?: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.tenantId = payload.tenantId;
    req.tenantSchema = payload.schema;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
