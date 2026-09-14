import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { provisionTenantSchema } from './tenant-data-source';
import { Tenant } from '../entities/public/Tenant';
import { Order, OrderStatus } from '../entities/tenant/Order';
import { User } from '../entities/tenant/User';

interface MockItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface MockOrder {
  clientName: string;
  status: OrderStatus;
  notes?: string;
  deliveryDate?: string;
  items: MockItem[];
}

const MOCK_ORDERS: MockOrder[] = [
  {
    clientName: 'Loja Vestta',
    status: OrderStatus.AwaitingCutting,
    deliveryDate: '2026-09-20',
    items: [
      { productName: 'Camiseta básica algodão', quantity: 50, unitPrice: 18.9 },
      { productName: 'Camiseta polo piquet', quantity: 30, unitPrice: 34.5 },
    ],
  },
  {
    clientName: 'Boutique Bella Flor',
    status: OrderStatus.AwaitingCutting,
    deliveryDate: '2026-09-22',
    notes: 'Cliente pediu etiqueta personalizada com a marca da loja.',
    items: [
      { productName: 'Vestido midi floral', quantity: 20, unitPrice: 89.9 },
      { productName: 'Blusa cropped linho', quantity: 15, unitPrice: 45.0 },
    ],
  },
  {
    clientName: 'Escola Municipal Horizonte',
    status: OrderStatus.InProduction,
    deliveryDate: '2026-09-18',
    notes: 'Conferir tamanhos P, M e G separadamente antes de embalar.',
    items: [
      { productName: 'Uniforme escolar (conjunto)', quantity: 120, unitPrice: 52.0 },
      { productName: 'Agasalho escolar', quantity: 80, unitPrice: 68.5 },
    ],
  },
  {
    clientName: 'Atacado Confecções Lima',
    status: OrderStatus.InProduction,
    deliveryDate: '2026-09-25',
    items: [
      { productName: 'Calça moletom unissex', quantity: 200, unitPrice: 42.9 },
      { productName: 'Short sarja masculino', quantity: 150, unitPrice: 38.0 },
      { productName: 'Camiseta oversized', quantity: 100, unitPrice: 27.5 },
    ],
  },
  {
    clientName: 'Confeitaria Doce Arte',
    status: OrderStatus.Invoiced,
    deliveryDate: '2026-09-15',
    items: [
      { productName: 'Avental em sarja', quantity: 25, unitPrice: 32.0 },
      { productName: 'Jaleco manga longa', quantity: 15, unitPrice: 55.9 },
    ],
  },
  {
    clientName: 'Maria Fernanda Costa',
    status: OrderStatus.Invoiced,
    deliveryDate: '2026-09-14',
    notes: 'Retirada no balcão.',
    items: [{ productName: 'Vestido de festa sob medida', quantity: 1, unitPrice: 450.0 }],
  },
  {
    clientName: 'Loja Moda Praia',
    status: OrderStatus.Finished,
    deliveryDate: '2026-09-05',
    items: [
      { productName: 'Saída de praia estampada', quantity: 40, unitPrice: 49.9 },
      { productName: 'Canga viscose', quantity: 60, unitPrice: 24.9 },
    ],
  },
  {
    clientName: 'Depósito de Roupas Central',
    status: OrderStatus.Finished,
    deliveryDate: '2026-08-30',
    items: [
      { productName: 'Jaqueta corta-vento', quantity: 80, unitPrice: 79.9 },
      { productName: 'Calça jeans skinny', quantity: 60, unitPrice: 69.9 },
      { productName: 'Camisa social manga curta', quantity: 45, unitPrice: 59.9 },
    ],
  },
  {
    clientName: 'Uniformes Silva & Filhos',
    status: OrderStatus.Finished,
    items: [
      { productName: 'Jaleco hospitalar', quantity: 35, unitPrice: 62.0 },
      { productName: 'Calça brim profissional', quantity: 40, unitPrice: 58.0 },
    ],
  },
  {
    clientName: 'Academia Corpo Livre',
    status: OrderStatus.Cancelled,
    notes: 'Cliente cancelou — refazer orçamento com novo modelo.',
    items: [{ productName: 'Camiseta dry-fit com logo', quantity: 70, unitPrice: 29.9 }],
  },
];

async function seedTenant(tenant: Tenant): Promise<void> {
  const dataSource = await provisionTenantSchema(tenant.schemaName);

  try {
    const orderRepository = dataSource.getRepository(Order);
    const userRepository = dataSource.getRepository(User);

    const existing = await orderRepository.count();
    if (existing > 0) {
      console.log(`[${tenant.slug}] já possui ${existing} pedido(s) — pulando.`);
      return;
    }

    const creator = (await userRepository.find())[0] ?? null;

    const orders = MOCK_ORDERS.map(({ items, ...order }) =>
      orderRepository.create({
        ...order,
        createdBy: creator,
        items: items.map((item) => ({ ...item })),
      }),
    );

    await orderRepository.save(orders);
    console.log(`[${tenant.slug}] ${orders.length} pedidos mockados criados.`);
  } finally {
    await dataSource.destroy();
  }
}

async function main(): Promise<void> {
  await AppDataSource.initialize();

  const arg = process.argv[2];
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const tenants = arg
    ? await tenantRepository.find({ where: [{ slug: arg }, { schemaName: arg }] })
    : await tenantRepository.find();

  if (tenants.length === 0) {
    console.error(`Tenant "${arg}" não encontrado.`);
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
