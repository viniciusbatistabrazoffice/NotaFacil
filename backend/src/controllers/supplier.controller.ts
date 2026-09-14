import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';

const supplierService = new SupplierService();

export class SupplierController {
  async findAll(req: Request, res: Response): Promise<Response> {
    return res.json(await supplierService.findAll(req.tenantSchema as string));
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await supplierService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await supplierService.update(req.tenantSchema as string, req.params.id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await supplierService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }
}