import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { User } from '../entities/tenant/User';

export function getUserRepository(schemaName: string): Promise<Repository<User>> {
  return getTenantRepository(schemaName, User);
}
