import { Like } from 'typeorm';
import { Production, ProductionStage } from '../entities/tenant/Production';
import { getProductionRepository } from '../repositories/production.repository';

type ProductionInput = Pick<Production, 'product' | 'client' | 'stage' | 'progress' | 'dueDate' | 'orderId'>;

interface FetchOptions {
  stage?: string;
  search?: string;
}

function normalizeInput(data: ProductionInput): ProductionInput {
  return {
    product: data.product?.trim(),
    client: data.client?.trim(),
    stage: data.stage as ProductionStage,
    progress: Math.min(100, Math.max(0, Number(data.progress))),
    dueDate: data.dueDate,
    orderId: data.orderId ?? null,
  };
}

function validateInput(data: ProductionInput): void {
  if (!data.product || !data.client || !data.dueDate) {
    throw new Error('Product, client, and due date are required');
  }
  if (data.progress < 0 || data.progress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }
  if (!Object.values(ProductionStage).includes(data.stage)) {
    throw new Error('Invalid production stage');
  }
}

export class ProductionService {
  async findAll(schemaName: string, options: FetchOptions = {}): Promise<Production[]> {
    const repository = await getProductionRepository(schemaName);
    const query = repository.createQueryBuilder('production');

    if (options.stage) {
      query.andWhere('production.stage = :stage', { stage: options.stage });
    }

    if (options.search) {
      const searchTerm = options.search.toLowerCase().replace(/^#/, '');
      query.andWhere(
        '(LOWER(production.product) LIKE :search OR LOWER(production.client) LIKE :search OR LOWER(production.id) LIKE :search OR CAST(production.orderId AS TEXT) = :exactSearch)',
        {
          search: `%${searchTerm}%`,
          exactSearch: searchTerm,
        },
      );
    }

    return query.orderBy('production.dueDate', 'ASC').getMany();
  }

  async create(schemaName: string, data: ProductionInput): Promise<Production> {
    const production = normalizeInput(data);
    validateInput(production);
    const repository = await getProductionRepository(schemaName);
    return repository.save(repository.create(production));
  }

  async update(schemaName: string, id: string, data: Partial<ProductionInput>): Promise<Production> {
    const repository = await getProductionRepository(schemaName);
    const existing = await this.findById(schemaName, id);

    const updates = {
      ...(data.product !== undefined && { product: data.product?.trim() }),
      ...(data.client !== undefined && { client: data.client?.trim() }),
      ...(data.stage !== undefined && { stage: data.stage }),
      ...(data.progress !== undefined && { progress: Math.min(100, Math.max(0, Number(data.progress))) }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.orderId !== undefined && { orderId: data.orderId ?? null }),
    };

    repository.merge(existing, updates);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getProductionRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }

  private async findById(schemaName: string, id: string): Promise<Production> {
    const repository = await getProductionRepository(schemaName);
    const production = await repository.findOneBy({ id });
    if (!production) throw new Error('Production order not found');
    return production;
  }
}
