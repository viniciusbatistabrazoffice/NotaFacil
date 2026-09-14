import { Product } from '../entities/tenant/Product';
import { getProductRepository } from '../repositories/product.repository';

type ProductInput = Pick<Product, 'name' | 'code' | 'category' | 'price' | 'sizes'>;

function normalizeInput(data: ProductInput): ProductInput {
  return {
    name: data.name?.trim(),
    code: data.code?.trim().toUpperCase(),
    category: data.category?.trim(),
    price: Number(data.price),
    sizes: data.sizes?.trim(),
  };
}

function validateInput(data: ProductInput): void {
  if (!data.name || !data.code || !data.category || !data.sizes) {
    throw new Error('Product name, code, category, and sizes are required');
  }
  if (data.price < 0) {
    throw new Error('Product price must be non-negative');
  }
}

export class ProductService {
  async findAll(schemaName: string): Promise<Product[]> {
    const repository = await getProductRepository(schemaName);
    return repository.find({ order: { name: 'ASC' } });
  }

  async create(schemaName: string, data: ProductInput): Promise<Product> {
    const product = normalizeInput(data);
    validateInput(product);
    const repository = await getProductRepository(schemaName);
    if (await repository.existsBy({ code: product.code })) {
      throw new Error('Product code already in use');
    }
    return repository.save(repository.create(product));
  }

  async update(schemaName: string, id: string, data: ProductInput): Promise<Product> {
    const product = normalizeInput(data);
    validateInput(product);
    const repository = await getProductRepository(schemaName);
    const existing = await this.findById(schemaName, id);
    if (product.code !== existing.code) {
      const sameCode = await repository.findOneBy({ code: product.code });
      if (sameCode) throw new Error('Product code already in use');
    }
    repository.merge(existing, product);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getProductRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }

  private async findById(schemaName: string, id: string): Promise<Product> {
    const repository = await getProductRepository(schemaName);
    const product = await repository.findOneBy({ id });
    if (!product) throw new Error('Product not found');
    return product;
  }
}
