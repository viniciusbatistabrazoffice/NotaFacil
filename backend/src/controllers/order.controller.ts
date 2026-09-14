import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const { status, search } = req.query;
    const orders = await orderService.findAll(req.tenantSchema as string, {
      status: status as string | undefined,
      search: search as string | undefined,
    });
    return res.json(orders);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    const order = await orderService.findById(req.tenantSchema as string, id);
    return res.json(order);
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await orderService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    return res.json(await orderService.update(req.tenantSchema as string, id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    await orderService.delete(req.tenantSchema as string, id);
    return res.status(204).send();
  }
}
