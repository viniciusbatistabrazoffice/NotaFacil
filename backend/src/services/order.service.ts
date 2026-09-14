import { Order, OrderStatus } from '../entities/tenant/Order';
import { OrderItem } from '../entities/tenant/OrderItem';
import { getOrderRepository } from '../repositories/order.repository';

interface OrderFilters {
  status?: string;
  search?: string;
}

type OrderInput = Pick<Order, 'clientName' | 'status' | 'notes' | 'deliveryDate'>;

function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}

function getItemsCount(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function normalizeInput(data: Partial<OrderInput>): Partial<OrderInput> {
  return {
    ...(data.clientName !== undefined && { clientName: data.clientName?.trim() }),
    ...(data.status !== undefined && { status: data.status as OrderStatus }),
    ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
    ...(data.deliveryDate !== undefined && { deliveryDate: data.deliveryDate || null }),
  };
}

function validateCreateInput(data: OrderInput): void {
  if (!data.clientName) {
    throw new Error('Client name is required');
  }
  if (!isOrderStatus(data.status)) {
    throw new Error('Invalid order status');
  }
}

function validateUpdateInput(data: Partial<OrderInput>): void {
  if (data.status && !isOrderStatus(data.status)) {
    throw new Error('Invalid order status');
  }
}

export class OrderService {
  async findAll(schemaName: string, filters: OrderFilters = {}) {
    if (filters.status && !isOrderStatus(filters.status)) {
      throw new Error('Invalid order status');
    }

    const orderRepository = await getOrderRepository(schemaName);
    const query = orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('order.createdBy', 'createdBy')
      .orderBy('order.createdAt', 'DESC');

    if (filters.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        '(order.clientName ILIKE :search OR CAST(order.id AS TEXT) = :exactId)',
        { search: `%${filters.search}%`, exactId: filters.search.replace(/^#/, '') },
      );
    }

    const orders = await query.getMany();

    return orders.map(({ items, ...order }) => ({
      ...order,
      itemsCount: getItemsCount(items),
      total: getTotal(items),
    }));
  }

  async findById(schemaName: string, id: number) {
    const orderRepository = await getOrderRepository(schemaName);
    const order = await orderRepository.findOne({
      where: { id },
      relations: { items: true, createdBy: true },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    const { items } = order;
    return { ...order, itemsCount: getItemsCount(items), total: getTotal(items) };
  }

  async create(schemaName: string, data: OrderInput): Promise<Order> {
    const order = normalizeInput(data) as OrderInput;
    validateCreateInput(order);
    const orderRepository = await getOrderRepository(schemaName);
    return orderRepository.save(orderRepository.create(order));
  }

  async update(schemaName: string, id: number, data: Partial<OrderInput>): Promise<Order> {
    validateUpdateInput(data);
    const orderRepository = await getOrderRepository(schemaName);
    const order = await orderRepository.findOneBy({ id });
    if (!order) {
      throw new Error('Order not found');
    }
    const updates = normalizeInput(data);
    orderRepository.merge(order, updates);
    return orderRepository.save(order);
  }

  async delete(schemaName: string, id: number): Promise<void> {
    const orderRepository = await getOrderRepository(schemaName);
    const order = await orderRepository.findOneBy({ id });
    if (!order) {
      throw new Error('Order not found');
    }
    await orderRepository.remove(order);
  }
}
