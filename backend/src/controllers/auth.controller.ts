import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const result = await authService.login(req.body);
    return res.json(result);
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const result = await authService.forgotPassword(req.body.tenant, req.body.email);
    return res.json(result);
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const result = await authService.resetPassword(
      req.body.tenant,
      req.body.token,
      req.body.password,
    );
    return res.json(result);
  }
}
