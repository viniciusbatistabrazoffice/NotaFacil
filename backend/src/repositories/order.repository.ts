import { Repository } from 'typeorm';
import { getTenantRepository } from '../database/tenant-data-source';
import { Order } from '../entities/tenant/Order';

export function getOrderRepository(schemaName: string): Promise<Repository<Order>> {
  return getTenantRepository(schemaName, Order);
}
