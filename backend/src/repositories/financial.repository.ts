import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { FinancialTransaction } from '../entities/tenant/FinancialTransaction';

export function getFinancialTransactionRepository(
  schemaName: string,
): Promise<Repository<FinancialTransaction>> {
  return getTenantRepository(schemaName, FinancialTransaction);
}