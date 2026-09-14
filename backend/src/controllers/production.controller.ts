import { Request, Response } from 'express';
import { ProductionService } from '../services/production.service';

const productionService = new ProductionService();

export class ProductionController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const { stage, search } = req.query;
    return res.json(
      await productionService.findAll(req.tenantSchema as string, {
        stage: stage as string | undefined,
        search: search as string | undefined,
      }),
    );
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await productionService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await productionService.update(req.tenantSchema as string, req.params.id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await productionService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }
}
