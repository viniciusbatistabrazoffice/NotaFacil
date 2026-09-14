import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

const clientService = new ClientService();

export class ClientController {
  async findAll(req: Request, res: Response): Promise<Response> {
    return res.json(await clientService.findAll(req.tenantSchema as string));
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await clientService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await clientService.update(req.tenantSchema as string, req.params.id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await clientService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }
}
