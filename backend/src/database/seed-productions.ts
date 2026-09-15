import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { provisionTenantSchema } from './tenant-data-source';
import { Tenant } from '../entities/public/Tenant';
import { Production, ProductionStage } from '../entities/tenant/Production';
import { Order } from '../entities/tenant/Order';

async function seedTenant(tenant: Tenant): Promise<void> {
  const dataSource = await provisionTenantSchema(tenant.schemaName);

  try {
    const productionRepository = dataSource.getRepository(Production);
    const orderRepository = dataSource.getRepository(Order);

    const existing = await productionRepository.count();
    if (existing > 0) {
      console.log(`[${tenant.slug}] já possui ${existing} ordem(ns) de produção — pulando.`);
      return;
    }

    // Get all orders to create productions from them
    const orders = await orderRepository.find();
    
    if (orders.length === 0) {
      console.log(`[${tenant.slug}] nenhum pedido encontrado para criar produções.`);
      return;
    }

    const productions: Production[] = [];
    const stages = Object.values(ProductionStage);

    for (const order of orders) {
      // Create one production per order
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const progress = stage === ProductionStage.Done ? 100 : Math.floor(Math.random() * 90) + 10;
      
      const production = productionRepository.create({
        product: order.items && order.items.length > 0 ? order.items[0].productName : 'Produto',
        client: order.clientName,
        stage,
        progress,
        dueDate: order.deliveryDate || new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        orderId: order.id,
      });
      
      productions.push(production);
    }

    await productionRepository.save(productions);
    console.log(`[${tenant.slug}] ${productions.length} ordens de produção criadas.`);
  } finally {
    await dataSource.destroy();
  }
}

async function main(): Promise<void> {
  await AppDataSource.initialize();

  const tenantRepository = AppDataSource.getRepository(Tenant);
  const tenants = await tenantRepository.find();

  if (tenants.length === 0) {
    console.error('Nenhum tenant encontrado.');
    process.exitCode = 1;
    return;
  }

  for (const tenant of tenants) {
    await seedTenant(tenant);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => AppDataSource.destroy());
