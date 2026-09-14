import { Request, Response } from 'express';
import { CashService } from '../services/cash.service';

const cashService = new CashService();

export class CashController {
  async getBalance(req: Request, res: Response): Promise<Response> {
    const balance = await cashService.getBalance(req.tenantSchema as string);
    return res.json(balance);
  }

  async getMovements(req: Request, res: Response): Promise<Response> {
    const { startDate, endDate, type } = req.query;
    const movements = await cashService.getMovements(req.tenantSchema as string, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      type: type as string | undefined,
    });
    return res.json(movements);
  }

  async deposit(req: Request, res: Response): Promise<Response> {
    const deposit = await cashService.deposit(req.tenantSchema as string, req.body, req.userId);
    return res.status(201).json(deposit);
  }

  async withdrawal(req: Request, res: Response): Promise<Response> {
    const withdrawal = await cashService.withdrawal(req.tenantSchema as string, req.body, req.userId);
    return res.status(201).json(withdrawal);
  }

  async getReconciliation(req: Request, res: Response): Promise<Response> {
    const reconciliation = await cashService.getReconciliation(req.tenantSchema as string);
    return res.json(reconciliation);
  }

  async createReconciliation(req: Request, res: Response): Promise<Response> {
    const reconciliation = await cashService.createReconciliation(req.tenantSchema as string, req.body, req.userId);
    return res.status(201).json(reconciliation);
  }

  async getDailyReport(req: Request, res: Response): Promise<Response> {
    const { date } = req.query;
    const report = await cashService.getDailyReport(req.tenantSchema as string, date as string | undefined);
    return res.json(report);
  }
}
