import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Client } from '../entities/tenant/Client';

export function getClientRepository(schemaName: string): Promise<Repository<Client>> {
  return getTenantRepository(schemaName, Client);
}
