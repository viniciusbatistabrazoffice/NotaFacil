import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Product } from '../entities/tenant/Product';

export function getProductRepository(schemaName: string): Promise<Repository<Product>> {
  return getTenantRepository(schemaName, Product);
}
