import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async findAll(req: Request, res: Response): Promise<Response> {
    return res.json(await productService.findAll(req.tenantSchema as string));
  }

  async create(req: Request, res: Response): Promise<Response> {
    return res.status(201).json(await productService.create(req.tenantSchema as string, req.body));
  }

  async update(req: Request, res: Response): Promise<Response> {
    return res.json(await productService.update(req.tenantSchema as string, req.params.id, req.body));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await productService.delete(req.tenantSchema as string, req.params.id);
    return res.status(204).send();
  }
}
