import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Supplier } from '../entities/tenant/Supplier';

export function getSupplierRepository(schemaName: string): Promise<Repository<Supplier>> {
  return getTenantRepository(schemaName, Supplier);
}