import { Request, Response } from 'express';
import { FinancialService } from '../services/financial.service';

const financialService = new FinancialService();

export class FinancialController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const { type, status } = req.query;
    const transactions = await financialService.findAll(req.tenantSchema as string, {
      type: type as string | undefined,
      status: status as string | undefined,
    });
    return res.json(transactions);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const transaction = await financialService.create(req.tenantSchema as string, req.body, req.userId);
    return res.status(201).json(transaction);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const transaction = await financialService.update(req.tenantSchema as string, req.params.id, req.body);
    return res.json(transaction);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await financialService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }

  async cashSummary(req: Request, res: Response): Promise<Response> {
    return res.json(await financialService.getCashSummary(req.tenantSchema as string));
  }

  async overview(req: Request, res: Response): Promise<Response> {
    return res.json(await financialService.getOverview(req.tenantSchema as string));
  }

  async report(req: Request, res: Response): Promise<Response> {
    return res.json(await financialService.getReport(req.tenantSchema as string));
  }
}