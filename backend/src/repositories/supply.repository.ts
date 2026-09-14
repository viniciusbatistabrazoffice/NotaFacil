import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Supply } from '../entities/tenant/Supply';

export function getSupplyRepository(schemaName: string): Promise<Repository<Supply>> {
  return getTenantRepository(schemaName, Supply);
}
