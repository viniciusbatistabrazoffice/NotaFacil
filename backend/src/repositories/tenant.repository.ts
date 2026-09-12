import { AppDataSource } from '../database/data-source';
import { Tenant } from '../entities/public/Tenant';

export const tenantRepository = AppDataSource.getRepository(Tenant);
