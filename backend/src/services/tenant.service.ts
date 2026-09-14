import { randomBytes } from 'crypto';
import { Tenant } from '../entities/public/Tenant';
import { tenantRepository } from '../repositories/tenant.repository';
import { dropTenantSchema, provisionTenantSchema } from '../database/tenant-data-source';
import { slugify, toSchemaName } from '../utils/slug';

export class TenantService {
  async findBySlug(slug: string): Promise<Tenant | null> {
    const normalized = slugify(slug);
    if (!normalized) {
      return null;
    }
    return tenantRepository.findOneBy({ slug: normalized });
  }

  async create(name: string): Promise<Tenant> {
    const base = slugify(name) || 'org';
    let slug = base;
    while (await tenantRepository.existsBy({ slug })) {
      slug = `${base}-${randomBytes(2).toString('hex')}`;
    }

    const tenant = tenantRepository.create({
      name,
      slug,
      schemaName: toSchemaName(slug),
    });
    const saved = await tenantRepository.save(tenant);

    try {
      await provisionTenantSchema(saved.schemaName);
    } catch (error) {
      await this.destroy(saved);
      throw error;
    }
    return saved;
  }

  async destroy(tenant: Tenant): Promise<void> {
    await dropTenantSchema(tenant.schemaName);
    await tenantRepository.remove(tenant);
  }
}
