import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { env } from '../config/env';

export const baseDataSourceOptions = {
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  logging: env.db.logging,
} satisfies DataSourceOptions;

export const AppDataSource = new DataSource({
  ...baseDataSourceOptions,
  synchronize: env.nodeEnv === 'development',
  entities: [join(__dirname, '../entities/public/*.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
});
