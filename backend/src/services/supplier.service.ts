import { Supplier } from '../entities/tenant/Supplier';
import { getSupplierRepository } from '../repositories/supplier.repository';

type SupplierInput = Pick<
  Supplier,
  'name' | 'document' | 'category' | 'email' | 'phone' | 'city' | 'state'
>;

function normalizeInput(data: SupplierInput): SupplierInput {
  return {
    name: data.name?.trim(),
    document: data.document?.trim(),
    category: data.category?.trim(),
    email: data.email?.trim().toLowerCase(),
    phone: data.phone?.trim(),
    city: data.city?.trim(),
    state: data.state?.trim().toUpperCase(),
  };
}

function validateInput(data: SupplierInput): void {
  if (Object.values(data).some((value) => !value)) {
    throw new Error('All supplier fields are required');
  }
  if (data.state.length !== 2) {
    throw new Error('Supplier state must have 2 characters');
  }
}

export class SupplierService {
  async findAll(schemaName: string): Promise<Supplier[]> {
    const repository = await getSupplierRepository(schemaName);
    return repository.find({ order: { name: 'ASC' } });
  }

  async create(schemaName: string, data: SupplierInput): Promise<Supplier> {
    const supplier = normalizeInput(data);
    validateInput(supplier);
    const repository = await getSupplierRepository(schemaName);
    if (await repository.existsBy({ document: supplier.document })) {
      throw new Error('Supplier document already in use');
    }
    return repository.save(repository.create(supplier));
  }

  async update(schemaName: string, id: string, data: SupplierInput): Promise<Supplier> {
    const supplier = normalizeInput(data);
    validateInput(supplier);
    const repository = await getSupplierRepository(schemaName);
    const existing = await this.findById(schemaName, id);
    if (supplier.document !== existing.document) {
      const sameDocument = await repository.findOneBy({ document: supplier.document });
      if (sameDocument) throw new Error('Supplier document already in use');
    }
    repository.merge(existing, supplier);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getSupplierRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }

  private async findById(schemaName: string, id: string): Promise<Supplier> {
    const repository = await getSupplierRepository(schemaName);
    const supplier = await repository.findOneBy({ id });
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  }
}