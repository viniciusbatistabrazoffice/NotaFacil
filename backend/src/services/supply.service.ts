import { Supply } from '../entities/tenant/Supply';
import { getSupplyRepository } from '../repositories/supply.repository';

type SupplyInput = Pick<Supply, 'name' | 'category' | 'unit' | 'stock' | 'minStock'>;

function normalizeInput(data: SupplyInput): SupplyInput {
  return {
    name: data.name?.trim(),
    category: data.category?.trim(),
    unit: data.unit?.trim(),
    stock: Number(data.stock),
    minStock: Number(data.minStock),
  };
}

function validateInput(data: SupplyInput): void {
  if (!data.name || !data.category || !data.unit) {
    throw new Error('Supply name, category, and unit are required');
  }
  if (data.stock < 0 || data.minStock < 0) {
    throw new Error('Stock and minimum stock must be non-negative');
  }
}

export class SupplyService {
  async findAll(schemaName: string): Promise<Supply[]> {
    const repository = await getSupplyRepository(schemaName);
    return repository.find({ order: { name: 'ASC' } });
  }

  async create(schemaName: string, data: SupplyInput): Promise<Supply> {
    const supply = normalizeInput(data);
    validateInput(supply);
    const repository = await getSupplyRepository(schemaName);
    return repository.save(repository.create(supply));
  }

  async update(schemaName: string, id: string, data: SupplyInput): Promise<Supply> {
    const supply = normalizeInput(data);
    validateInput(supply);
    const repository = await getSupplyRepository(schemaName);
    const existing = await this.findById(schemaName, id);
    repository.merge(existing, supply);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getSupplyRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }

  private async findById(schemaName: string, id: string): Promise<Supply> {
    const repository = await getSupplyRepository(schemaName);
    const supply = await repository.findOneBy({ id });
    if (!supply) throw new Error('Supply not found');
    return supply;
  }
}
