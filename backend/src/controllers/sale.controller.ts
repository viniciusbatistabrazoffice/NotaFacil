import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';
import { SaleStatus } from '../entities/tenant/Sale';

const saleService = new SaleService();

export class SaleController {
  async createSale(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.createSale(req.tenantSchema as string, req.body, req.userId as string);
      return res.status(201).json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create sale';
      return res.status(400).json({ message });
    }
  }

  async getSale(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.findById(req.tenantSchema as string, req.params.id);
      return res.json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sale not found';
      return res.status(404).json({ message });
    }
  }

  async listSales(req: Request, res: Response): Promise<Response> {
    try {
      const { status, startDate, endDate } = req.query;
      const sales = await saleService.findAll(req.tenantSchema as string, {
        status: status as SaleStatus | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      });
      return res.json(sales);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list sales';
      return res.status(400).json({ message });
    }
  }

  async completeSale(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.completeSale(
        req.tenantSchema as string,
        req.params.id,
        req.body,
        req.userId as string,
      );
      return res.json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete sale';
      return res.status(400).json({ message });
    }
  }

  async cancelSale(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.cancelSale(req.tenantSchema as string, req.params.id);
      return res.json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel sale';
      return res.status(400).json({ message });
    }
  }

  async updateSaleItem(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.updateSaleItem(
        req.tenantSchema as string,
        req.params.id,
        req.params.itemId,
        req.body,
      );
      return res.json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update sale item';
      return res.status(400).json({ message });
    }
  }

  async removeSaleItem(req: Request, res: Response): Promise<Response> {
    try {
      const sale = await saleService.removeSaleItem(req.tenantSchema as string, req.params.id, req.params.itemId);
      return res.json(sale);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove sale item';
      return res.status(400).json({ message });
    }
  }

  async getDailySalesReport(req: Request, res: Response): Promise<Response> {
    try {
      const { date } = req.query;
      const report = await saleService.getDailySalesReport(req.tenantSchema as string, date as string | undefined);
      return res.json(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get daily sales report';
      return res.status(400).json({ message });
    }
  }

  async getSalesMetrics(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await saleService.getSalesMetrics(
        req.tenantSchema as string,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      return res.json(metrics);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get sales metrics';
      return res.status(400).json({ message });
    }
  }
}
