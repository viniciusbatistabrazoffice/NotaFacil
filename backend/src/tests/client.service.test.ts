import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import { ClientService } from '../services/client.service';
import * as clientRepository from '../repositories/client.repository';

test('ClientService.findAll: deve retornar todos os clientes', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockClients = [
      {
        id: 'client-1',
        name: 'Client A',
        document: '12345678901234',
        email: 'client-a@example.com',
        phone: '11999999999',
        city: 'São Paulo',
        state: 'SP',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'client-2',
        name: 'Client B',
        document: '98765432109876',
        email: 'client-b@example.com',
        phone: '21999999999',
        city: 'Rio de Janeiro',
        state: 'RJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      find: sandbox.stub().resolves(mockClients),
    } as any);

    const clientService = new ClientService();
    const result = await clientService.findAll('tenant_test');

    assert.equal(result.length, 2);
    assert.equal(result[0].id, 'client-1');
    assert.equal(result[0].name, 'Client A');
  } finally {
    sandbox.restore();
  }
});

test('ClientService.create: deve criar novo cliente com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockClient = {
      id: 'client-1',
      name: 'Client A',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
      create: sandbox.stub().returns(mockClient),
      save: sandbox.stub().resolves(mockClient),
    } as any);

    const clientService = new ClientService();
    const result = await clientService.create('tenant_test', {
      name: 'Client A',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
    });

    assert.equal(result.id, 'client-1');
    assert.equal(result.name, 'Client A');
    assert.equal(result.state, 'SP');
  } finally {
    sandbox.restore();
  }
});

test('ClientService.create: deve normalizar entrada (trim e uppercase state)', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockClient = {
      id: 'client-1',
      name: 'Client A',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createStub = sandbox.stub().returns(mockClient);
    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
      create: createStub,
      save: sandbox.stub().resolves(mockClient),
    } as any);

    const clientService = new ClientService();
    await clientService.create('tenant_test', {
      name: '  Client A  ',
      document: '  12345678901234  ',
      email: '  client-a@example.com  ',
      phone: '  11999999999  ',
      city: '  São Paulo  ',
      state: '  sp  ',
    });

    const createdClient = createStub.getCall(0).args[0];
    assert.equal(createdClient.name, 'Client A');
    assert.equal(createdClient.state, 'SP');
  } finally {
    sandbox.restore();
  }
});

test('ClientService.create: deve lançar erro se campos obrigatórios estão faltando', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
    } as any);

    const clientService = new ClientService();
    try {
      await clientService.create('tenant_test', {
        name: '',
        document: '12345678901234',
        email: 'client-a@example.com',
        phone: '11999999999',
        city: 'São Paulo',
        state: 'SP',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.ok(error.message.includes('required'));
    }
  } finally {
    sandbox.restore();
  }
});

test('ClientService.create: deve lançar erro se estado não tem 2 caracteres', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
    } as any);

    const clientService = new ClientService();
    try {
      await clientService.create('tenant_test', {
        name: 'Client A',
        document: '12345678901234',
        email: 'client-a@example.com',
        phone: '11999999999',
        city: 'São Paulo',
        state: 'S',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Client state must have 2 characters');
    }
  } finally {
    sandbox.restore();
  }
});

test('ClientService.create: deve lançar erro se documento já existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      existsBy: sandbox.stub().resolves(true),
    } as any);

    const clientService = new ClientService();
    try {
      await clientService.create('tenant_test', {
        name: 'Client A',
        document: '12345678901234',
        email: 'client-a@example.com',
        phone: '11999999999',
        city: 'São Paulo',
        state: 'SP',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Client document already in use');
    }
  } finally {
    sandbox.restore();
  }
});

test('ClientService.update: deve atualizar cliente com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingClient = {
      id: 'client-1',
      name: 'Client A',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedClient = {
      ...existingClient,
      name: 'Client A Updated',
      city: 'Campinas',
    };

    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingClient),
      merge: sandbox.stub().returns(updatedClient),
      save: sandbox.stub().resolves(updatedClient),
    } as any);

    const clientService = new ClientService();
    const result = await clientService.update('tenant_test', 'client-1', {
      name: 'Client A Updated',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'Campinas',
      state: 'SP',
    });

    assert.equal(result.id, 'client-1');
    assert.equal(result.name, 'Client A Updated');
    assert.equal(result.city, 'Campinas');
  } finally {
    sandbox.restore();
  }
});

test('ClientService.delete: deve deletar cliente com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockClient = {
      id: 'client-1',
      name: 'Client A',
      document: '12345678901234',
      email: 'client-a@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockClient),
      remove: sandbox.stub().resolves(undefined),
    } as any);

    const clientService = new ClientService();
    await clientService.delete('tenant_test', 'client-1');
  } finally {
    sandbox.restore();
  }
});

test('ClientService.delete: deve lançar erro se cliente não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(clientRepository, 'getClientRepository').resolves({
      findOneBy: sandbox.stub().resolves(null),
    } as any);

    const clientService = new ClientService();
    try {
      await clientService.delete('tenant_test', 'non-existent-id');
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Client not found');
    }
  } finally {
    sandbox.restore();
  }
});
