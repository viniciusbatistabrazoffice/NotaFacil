import { Invoice, InvoiceStatus } from '../entities/tenant/Invoice';
import { getInvoiceRepository } from '../repositories/invoice.repository';

type InvoiceInput = Pick<Invoice, 'clientName' | 'orderId' | 'status' | 'issueDate' | 'total' | 'notes'>;

interface FetchOptions {
  status?: string;
  search?: string;
}

function generateInvoiceNumber(): string {
  return String(Date.now() % 1000000000).padStart(9, '0');
}

function normalizeInput(data: Partial<InvoiceInput>): Partial<InvoiceInput> {
  return {
    ...(data.clientName !== undefined && { clientName: data.clientName?.trim() }),
    ...(data.orderId !== undefined && { orderId: data.orderId ? Number(data.orderId) : null }),
    ...(data.status !== undefined && { status: data.status as InvoiceStatus }),
    ...(data.issueDate !== undefined && { issueDate: data.issueDate }),
    ...(data.total !== undefined && { total: Number(data.total) }),
    ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
  };
}

function validateCreateInput(data: InvoiceInput): void {
  if (!data.clientName || !data.issueDate || data.total === undefined) {
    throw new Error('Client name, issue date, and total are required');
  }
  if (data.total < 0) {
    throw new Error('Invoice total must be non-negative');
  }
  if (!Object.values(InvoiceStatus).includes(data.status)) {
    throw new Error('Invalid invoice status');
  }
}

function validateUpdateInput(data: Partial<InvoiceInput>): void {
  if (data.status && !Object.values(InvoiceStatus).includes(data.status)) {
    throw new Error('Invalid invoice status');
  }
  if (data.total !== undefined && data.total < 0) {
    throw new Error('Invoice total must be non-negative');
  }
}

export class InvoiceService {
  async findAll(schemaName: string, options: FetchOptions = {}): Promise<Invoice[]> {
    const repository = await getInvoiceRepository(schemaName);
    const query = repository.createQueryBuilder('invoice');

    if (options.status) {
      query.andWhere('invoice.status = :status', { status: options.status });
    }

    if (options.search) {
      const searchTerm = options.search.toLowerCase().replace(/^#/, '');
      query.andWhere(
        '(LOWER(invoice.clientName) LIKE :search OR invoice.number LIKE :searchExact OR CAST(invoice.orderId AS TEXT) = :exactSearch)',
        {
          search: `%${searchTerm}%`,
          searchExact: `%${searchTerm}%`,
          exactSearch: searchTerm,
        },
      );
    }

    return query.orderBy('invoice.issueDate', 'DESC').getMany();
  }

  async findById(schemaName: string, id: number): Promise<Invoice> {
    const repository = await getInvoiceRepository(schemaName);
    const invoice = await repository.findOneBy({ id });
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }

  async create(schemaName: string, data: InvoiceInput): Promise<Invoice> {
    const invoice = normalizeInput(data) as InvoiceInput;
    validateCreateInput(invoice);
    const repository = await getInvoiceRepository(schemaName);
    
    const newInvoice = repository.create({
      ...invoice,
      number: generateInvoiceNumber(),
    });
    return repository.save(newInvoice);
  }

  async update(schemaName: string, id: number, data: Partial<InvoiceInput>): Promise<Invoice> {
    validateUpdateInput(data);
    const repository = await getInvoiceRepository(schemaName);
    const existing = await this.findById(schemaName, id);

    const updates = normalizeInput(data);
    repository.merge(existing, updates);
    return repository.save(existing);
  }

  async delete(schemaName: string, id: number): Promise<void> {
    const repository = await getInvoiceRepository(schemaName);
    await repository.remove(await this.findById(schemaName, id));
  }
}
