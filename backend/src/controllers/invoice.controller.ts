import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

const invoiceService = new InvoiceService();

export class InvoiceController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const { status, search } = req.query;
    return res.json(
      await invoiceService.findAll(req.tenantSchema as string, {
        status: status as string | undefined,
        search: search as string | undefined,
      }),
    );
  }

  async findById(req: Request, res: Response): Promise<Response> {
    return res.json(await invoiceService.findById(req.tenantSchema as string, Number(req.params.id)));
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await invoiceService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await invoiceService.update(req.tenantSchema as string, Number(req.params.id), req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await invoiceService.delete(req.tenantSchema as string, Number(req.params.id));
    return res.status(204).send();
  }
}
