import { Request, Response } from 'express';
import { SupplyService } from '../services/supply.service';

const supplyService = new SupplyService();

export class SupplyController {
  async findAll(req: Request, res: Response): Promise<Response> {
    return res.json(await supplyService.findAll(req.tenantSchema as string));
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await supplyService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await supplyService.update(req.tenantSchema as string, req.params.id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await supplyService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }
}
