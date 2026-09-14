import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { getTenantRepository } from '../database/tenant-data-source';
import { User } from '../entities/tenant/User';
import { tenantRepository } from './tenant.repository';

export function getUserRepository(schemaName: string): Promise<Repository<User>> {
  return getTenantRepository(schemaName, User);
}

export async function findUsersByEmailInSchema(
  schemaName: string,
  email: string,
): Promise<Array<Omit<User, 'password'> & { password: string }>> {
  if (!/^[a-z0-9_]+$/.test(schemaName)) {
    return [];
  }
  try {
    return await AppDataSource.query(
      `SELECT id, name, email, password, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM "${schemaName}".users WHERE email = $1`,
      [email],
    );
  } catch {
    return [];
  }
}

export async function emailExistsInAnyTenant(email: string): Promise<boolean> {
  const tenants = await tenantRepository.find();
  for (const tenant of tenants) {
    const users = await findUsersByEmailInSchema(tenant.schemaName, email);
    if (users.length > 0) {
      return true;
    }
  }
  return false;
}
