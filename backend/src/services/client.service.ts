import { Client } from '../entities/tenant/Client';
import { getClientRepository } from '../repositories/client.repository';

type ClientInput = Pick<Client, 'name' | 'document' | 'email' | 'phone' | 'city' | 'state'>;

function normalizeInput(data: ClientInput): ClientInput {
  return {
    name: data.name?.trim(),
    document: data.document?.trim(),
    email: data.email?.trim().toLowerCase(),
    phone: data.phone?.trim(),
    city: data.city?.trim(),
    state: data.state?.trim().toUpperCase(),
  };
}

function validateInput(data: ClientInput): void {
  if (Object.values(data).some((value) => !value)) {
    throw new Error('All client fields are required');
  }
  if (data.state.length !== 2) {
    throw new Error('Client state must have 2 characters');
  }
}

export class ClientService {
  async findAll(schemaName: string): Promise<Client[]> {
    const repository = await getClientRepository(schemaName);
    return repository.find({ order: { name: 'ASC' } });
  }

  async create(schemaName: string, data: ClientInput): Promise<Client> {
    const client = normalizeInput(data);
    validateInput(client);
    const repository = await getClientRepository(schemaName);
    if (await repository.existsBy({ document: client.document })) {
      throw new Error('Client document already in use');
    }
    return repository.save(repository.create(client));
  }

  async update(schemaName: string, id: string, data: ClientInput): Promise<Client> {
    const client = normalizeInput(data);
    validateInput(client);
    const repository = await getClientRepository(schemaName);
    const existing = await this.findById(schemaName, id);
    if (client.document !== existing.document) {
      const sameDocument = await repository.findOneBy({ document: client.document });
      if (sameDocument) throw new Error('Client document already in use');
    }
    repository.merge(existing, client);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getClientRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }

  private async findById(schemaName: string, id: string): Promise<Client> {
    const repository = await getClientRepository(schemaName);
    const client = await repository.findOneBy({ id });
    if (!client) throw new Error('Client not found');
    return client;
  }
}
