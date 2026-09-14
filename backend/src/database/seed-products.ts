import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { provisionTenantSchema } from './tenant-data-source';
import { Tenant } from '../entities/public/Tenant';
import { Product } from '../entities/tenant/Product';

interface MockProduct {
  name: string;
  code: string;
  category: string;
  price: number;
  sizes: string;
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    name: 'Camiseta Básica Algodão',
    code: 'CAM-001',
    category: 'Camisetas',
    price: 18.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Camiseta Polo Piquet',
    code: 'CAM-002',
    category: 'Camisetas',
    price: 34.50,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Camiseta Oversized',
    code: 'CAM-003',
    category: 'Camisetas',
    price: 27.50,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Camiseta Dry-Fit com Logo',
    code: 'CAM-004',
    category: 'Camisetas',
    price: 29.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Calça Moletom Unissex',
    code: 'CAL-001',
    category: 'Calças',
    price: 42.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Calça Jeans Skinny',
    code: 'CAL-002',
    category: 'Calças',
    price: 69.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Calça Brim Profissional',
    code: 'CAL-003',
    category: 'Calças',
    price: 58.00,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Short Sarja Masculino',
    code: 'SHO-001',
    category: 'Shorts',
    price: 38.00,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Vestido Midi Floral',
    code: 'VES-001',
    category: 'Vestidos',
    price: 89.90,
    sizes: 'P, M, G',
  },
  {
    name: 'Vestido de Festa Sob Medida',
    code: 'VES-002',
    category: 'Vestidos',
    price: 450.00,
    sizes: 'Único',
  },
  {
    name: 'Blusa Cropped Linho',
    code: 'BLU-001',
    category: 'Blusas',
    price: 45.00,
    sizes: 'P, M, G',
  },
  {
    name: 'Camisa Social Manga Curta',
    code: 'CAM-005',
    category: 'Camisas',
    price: 59.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Jaqueta Corta-Vento',
    code: 'JAC-001',
    category: 'Jaquetas',
    price: 79.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Agasalho Escolar',
    code: 'AGA-001',
    category: 'Agasalhos',
    price: 68.50,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Uniforme Escolar (Conjunto)',
    code: 'UNI-001',
    category: 'Uniformes',
    price: 52.00,
    sizes: 'P, M, G',
  },
  {
    name: 'Jaleco Manga Longa',
    code: 'JAL-001',
    category: 'Jalecos',
    price: 55.90,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Jaleco Hospitalar',
    code: 'JAL-002',
    category: 'Jalecos',
    price: 62.00,
    sizes: 'P, M, G, GG',
  },
  {
    name: 'Avental em Sarja',
    code: 'AVE-001',
    category: 'Aventais',
    price: 32.00,
    sizes: 'Único',
  },
  {
    name: 'Saída de Praia Estampada',
    code: 'SAI-001',
    category: 'Praia',
    price: 49.90,
    sizes: 'P, M, G',
  },
  {
    name: 'Canga Viscose',
    code: 'CAN-001',
    category: 'Praia',
    price: 24.90,
    sizes: 'Único',
  },
];

async function seedTenant(tenant: Tenant): Promise<void> {
  const dataSource = await provisionTenantSchema(tenant.schemaName);

  try {
    const productRepository = dataSource.getRepository(Product);

    const existing = await productRepository.count();
    if (existing > 0) {
      console.log(`[${tenant.slug}] já possui ${existing} produto(s) — pulando.`);
      return;
    }

    const products = MOCK_PRODUCTS.map((product) =>
      productRepository.create(product),
    );

    await productRepository.save(products);
    console.log(`[${tenant.slug}] ${products.length} produtos mockados criados.`);
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
