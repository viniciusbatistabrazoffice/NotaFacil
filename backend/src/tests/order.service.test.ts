import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '../entities/tenant/Order';
import * as orderRepository from '../repositories/order.repository';

test('OrderService.findAll: deve retornar todos os pedidos', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockOrders = [
      {
        id: 1,
        clientName: 'Client A',
        status: OrderStatus.PENDING,
        notes: 'Test order',
        deliveryDate: new Date(),
        items: [
          { id: 1, quantity: 2, unitPrice: 100 },
          { id: 2, quantity: 1, unitPrice: 50 },
        ],
        createdBy: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const queryBuilderStub = {
      leftJoinAndSelect: sandbox.stub().returnsThis(),
      orderBy: sandbox.stub().returnsThis(),
      andWhere: sandbox.stub().returnsThis(),
      getMany: sandbox.stub().resolves(mockOrders),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      createQueryBuilder: sandbox.stub().returns(queryBuilderStub),
    } as any);

    const orderService = new OrderService();
    const result = await orderService.findAll('tenant_test');

    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.equal(result[0].clientName, 'Client A');
    assert.equal(result[0].itemsCount, 3);
    assert.equal(result[0].total, 250);
  } finally {
    sandbox.restore();
  }
});

test('OrderService.findAll: deve filtrar por status', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockOrders = [
      {
        id: 1,
        clientName: 'Client A',
        status: OrderStatus.COMPLETED,
        notes: null,
        deliveryDate: null,
        items: [],
        createdBy: { id: 'user-1', name: 'John' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const queryBuilderStub = {
      leftJoinAndSelect: sandbox.stub().returnsThis(),
      orderBy: sandbox.stub().returnsThis(),
      andWhere: sandbox.stub().returnsThis(),
      getMany: sandbox.stub().resolves(mockOrders),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      createQueryBuilder: sandbox.stub().returns(queryBuilderStub),
    } as any);

    const orderService = new OrderService();
    const result = await orderService.findAll('tenant_test', { status: OrderStatus.COMPLETED });

    assert.equal(result.length, 1);
    assert.equal(result[0].status, OrderStatus.COMPLETED);
  } finally {
    sandbox.restore();
  }
});

test('OrderService.findAll: deve lançar erro com status inválido', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({} as any);

    const orderService = new OrderService();
    try {
      await orderService.findAll('tenant_test', { status: 'INVALID_STATUS' });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Invalid order status');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.findById: deve retornar pedido por ID', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockOrder = {
      id: 1,
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: 'Test order',
      deliveryDate: new Date(),
      items: [
        { id: 1, quantity: 2, unitPrice: 100 },
      ],
      createdBy: { id: 'user-1', name: 'John' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOne: sandbox.stub().resolves(mockOrder),
    } as any);

    const orderService = new OrderService();
    const result = await orderService.findById('tenant_test', 1);

    assert.equal(result.id, 1);
    assert.equal(result.clientName, 'Client A');
    assert.equal(result.itemsCount, 2);
    assert.equal(result.total, 200);
  } finally {
    sandbox.restore();
  }
});

test('OrderService.findById: deve lançar erro se pedido não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOne: sandbox.stub().resolves(null),
    } as any);

    const orderService = new OrderService();
    try {
      await orderService.findById('tenant_test', 999);
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Order not found');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.create: deve criar novo pedido com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockOrder = {
      id: 1,
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: 'Test order',
      deliveryDate: new Date(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      create: sandbox.stub().returns(mockOrder),
      save: sandbox.stub().resolves(mockOrder),
    } as any);

    const orderService = new OrderService();
    const result = await orderService.create('tenant_test', {
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: 'Test order',
      deliveryDate: new Date(),
    });

    assert.equal(result.id, 1);
    assert.equal(result.clientName, 'Client A');
    assert.equal(result.status, OrderStatus.PENDING);
  } finally {
    sandbox.restore();
  }
});

test('OrderService.create: deve lançar erro se clientName está faltando', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({} as any);

    const orderService = new OrderService();
    try {
      await orderService.create('tenant_test', {
        clientName: '',
        status: OrderStatus.PENDING,
        notes: 'Test',
        deliveryDate: new Date(),
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Client name is required');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.create: deve lançar erro com status inválido', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({} as any);

    const orderService = new OrderService();
    try {
      await orderService.create('tenant_test', {
        clientName: 'Client A',
        status: 'INVALID_STATUS' as any,
        notes: 'Test',
        deliveryDate: new Date(),
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Invalid order status');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.update: deve atualizar pedido com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingOrder = {
      id: 1,
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: 'Old notes',
      deliveryDate: new Date(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedOrder = {
      ...existingOrder,
      status: OrderStatus.COMPLETED,
      notes: 'Updated notes',
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingOrder),
      merge: sandbox.stub().returns(updatedOrder),
      save: sandbox.stub().resolves(updatedOrder),
    } as any);

    const orderService = new OrderService();
    const result = await orderService.update('tenant_test', 1, {
      status: OrderStatus.COMPLETED,
      notes: 'Updated notes',
    });

    assert.equal(result.id, 1);
    assert.equal(result.status, OrderStatus.COMPLETED);
    assert.equal(result.notes, 'Updated notes');
  } finally {
    sandbox.restore();
  }
});

test('OrderService.update: deve lançar erro se pedido não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOneBy: sandbox.stub().resolves(null),
    } as any);

    const orderService = new OrderService();
    try {
      await orderService.update('tenant_test', 999, {
        status: OrderStatus.COMPLETED,
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Order not found');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.update: deve lançar erro com status inválido', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingOrder = {
      id: 1,
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: null,
      deliveryDate: null,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingOrder),
    } as any);

    const orderService = new OrderService();
    try {
      await orderService.update('tenant_test', 1, {
        status: 'INVALID_STATUS' as any,
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Invalid order status');
    }
  } finally {
    sandbox.restore();
  }
});

test('OrderService.delete: deve deletar pedido com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockOrder = {
      id: 1,
      clientName: 'Client A',
      status: OrderStatus.PENDING,
      notes: null,
      deliveryDate: null,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockOrder),
      remove: sandbox.stub().resolves(undefined),
    } as any);

    const orderService = new OrderService();
    await orderService.delete('tenant_test', 1);
  } finally {
    sandbox.restore();
  }
});

test('OrderService.delete: deve lançar erro se pedido não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(orderRepository, 'getOrderRepository').resolves({
      findOneBy: sandbox.stub().resolves(null),
    } as any);

    const orderService = new OrderService();
    try {
      await orderService.delete('tenant_test', 999);
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Order not found');
    }
  } finally {
    sandbox.restore();
  }
});
