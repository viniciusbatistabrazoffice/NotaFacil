import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Sale } from '../entities/tenant/Sale';
import { SaleItem } from '../entities/tenant/SaleItem';

export function getSaleRepository(schemaName: string): Promise<Repository<Sale>> {
  return getTenantRepository(schemaName, Sale);
}

export function getSaleItemRepository(schemaName: string): Promise<Repository<SaleItem>> {
  return getTenantRepository(schemaName, SaleItem);
}
