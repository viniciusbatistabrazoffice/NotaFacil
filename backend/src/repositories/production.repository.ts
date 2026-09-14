import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Production } from '../entities/tenant/Production';

export function getProductionRepository(schemaName: string): Promise<Repository<Production>> {
  return getTenantRepository(schemaName, Production);
}
