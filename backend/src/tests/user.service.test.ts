import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/user.service';
import * as userRepository from '../repositories/user.repository';

test('UserService.findAll: deve retornar todos os usuários sem senhas', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUsers = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashed-password-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sandbox.stub(userRepository, 'getUserRepository').resolves({
      find: sandbox.stub().resolves(mockUsers),
    } as any);

    const userService = new UserService();
    const result = await userService.findAll('tenant_test');

    assert.equal(result.length, 2);
    assert.equal(result[0].id, 'user-1');
    assert.equal(result[0].name, 'John Doe');
    assert.ok(!('password' in result[0]));
  } finally {
    sandbox.restore();
  }
});

test('UserService.findById: deve retornar usuário por ID', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockUser),
    } as any);

    const userService = new UserService();
    const result = await userService.findById('tenant_test', 'user-1');

    assert.equal(result.id, 'user-1');
    assert.equal(result.name, 'John Doe');
  } finally {
    sandbox.restore();
  }
});

test('UserService.findById: deve lançar erro se usuário não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(null),
    } as any);

    const userService = new UserService();
    try {
      await userService.findById('tenant_test', 'non-existent-id');
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'User not found');
    }
  } finally {
    sandbox.restore();
  }
});

test('UserService.findPublicById: deve retornar usuário sem senha', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockUser),
    } as any);

    const userService = new UserService();
    const result = await userService.findPublicById('tenant_test', 'user-1');

    assert.equal(result.id, 'user-1');
    assert.ok(!('password' in result));
  } finally {
    sandbox.restore();
  }
});

test('UserService.create: deve criar novo usuário com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(false);
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      create: sandbox.stub().returns(mockUser),
      save: sandbox.stub().resolves(mockUser),
    } as any);

    const userService = new UserService();
    const result = await userService.create('tenant_test', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    assert.equal(result.id, 'user-1');
    assert.equal(result.name, 'John Doe');
    assert.ok(!('password' in result));
  } finally {
    sandbox.restore();
  }
});

test('UserService.create: deve lançar erro se email já existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(true);

    const userService = new UserService();
    try {
      await userService.create('tenant_test', {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Email already in use');
    }
  } finally {
    sandbox.restore();
  }
});

test('UserService.update: deve atualizar usuário com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = {
      ...existingUser,
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: await bcrypt.hash('newpassword123', 10),
    };

    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(false);
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingUser),
      merge: sandbox.stub().returns(updatedUser),
      save: sandbox.stub().resolves(updatedUser),
    } as any);

    const userService = new UserService();
    const result = await userService.update('tenant_test', 'user-1', {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'newpassword123',
    });

    assert.equal(result.id, 'user-1');
    assert.equal(result.name, 'Jane Doe');
    assert.ok(!('password' in result));
  } finally {
    sandbox.restore();
  }
});

test('UserService.update: deve lançar erro se novo email já existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(true);
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingUser),
    } as any);

    const userService = new UserService();
    try {
      await userService.update('tenant_test', 'user-1', {
        email: 'taken@example.com',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Email already in use');
    }
  } finally {
    sandbox.restore();
  }
});

test('UserService.delete: deve deletar usuário com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockUser),
      remove: sandbox.stub().resolves(undefined),
    } as any);

    const userService = new UserService();
    await userService.delete('tenant_test', 'user-1');
  } finally {
    sandbox.restore();
  }
});

test('UserService.delete: deve lançar erro ao tentar deletar própria conta', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockUser),
    } as any);

    const userService = new UserService();
    try {
      await userService.delete('tenant_test', 'user-1', 'user-1');
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Cannot delete your own account');
    }
  } finally {
    sandbox.restore();
  }
});
