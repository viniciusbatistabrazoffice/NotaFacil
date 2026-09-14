import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const users = await userService.findAll(req.tenantSchema as string);
    return res.json(users);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const user = await userService.findPublicById(
      req.tenantSchema as string,
      req.params.id as string,
    );
    return res.json(user);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const user = await userService.create(req.tenantSchema as string, req.body);
    return res.status(201).json(user);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const user = await userService.update(
      req.tenantSchema as string,
      req.params.id as string,
      req.body,
    );
    return res.json(user);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await userService.delete(
      req.tenantSchema as string,
      req.params.id as string,
      req.userId as string,
    );
    return res.status(204).send();
  }
}
