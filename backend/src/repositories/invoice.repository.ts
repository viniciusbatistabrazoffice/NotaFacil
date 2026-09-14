import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Invoice } from '../entities/tenant/Invoice';

export function getInvoiceRepository(schemaName: string): Promise<Repository<Invoice>> {
  return getTenantRepository(schemaName, Invoice);
}
