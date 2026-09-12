import 'reflect-metadata';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { join } from 'path';
import { AppDataSource, baseDataSourceOptions } from './data-source';
import { env } from '../config/env';

const tenantDataSources = new Map<string, Promise<DataSource>>();

export function getTenantDataSource(schemaName: string): Promise<DataSource> {
  let pending = tenantDataSources.get(schemaName);
  if (!pending) {
    const dataSource = new DataSource({
      ...baseDataSourceOptions,
      schema: schemaName,
      synchronize: env.nodeEnv === 'development',
      entities: [join(__dirname, '../entities/tenant/*.{ts,js}')],
    });
    pending = dataSource.initialize();
    tenantDataSources.set(schemaName, pending);
    pending.catch(() => tenantDataSources.delete(schemaName));
  }
  return pending;
}

export async function provisionTenantSchema(schemaName: string): Promise<DataSource> {
  await AppDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  return getTenantDataSource(schemaName);
}

export async function dropTenantSchema(schemaName: string): Promise<void> {
  const pending = tenantDataSources.get(schemaName);
  if (pending) {
    const dataSource = await pending.catch(() => null);
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
    tenantDataSources.delete(schemaName);
  }
  await AppDataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}

export async function getTenantRepository<T extends ObjectLiteral>(
  schemaName: string,
  entity: EntityTarget<T>,
): Promise<Repository<T>> {
  const dataSource = await getTenantDataSource(schemaName);
  return dataSource.getRepository(entity);
}
