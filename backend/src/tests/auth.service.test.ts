import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import { AuthService } from '../services/auth.service';
import * as userRepository from '../repositories/user.repository';
import * as tenantRepository from '../repositories/tenant.repository';
import { TenantService } from '../services/tenant.service';
import { signToken } from '../utils/jwt';

test('AuthService.register: deve registrar novo usuário com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Company',
      slug: 'test-company',
      schemaName: 'tenant_test_company',
    };

    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(TenantService.prototype, 'create').resolves(mockTenant);
    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(false);
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      create: sandbox.stub().returns(mockUser),
      save: sandbox.stub().resolves(mockUser),
    } as any);

    const authService = new AuthService();
    const result = await authService.register({
      companyName: 'Test Company',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    assert.equal(result.user.id, 'user-1');
    assert.equal(result.user.email, 'john@example.com');
    assert.equal(result.tenant.id, 'tenant-1');
    assert.ok(result.token);
  } finally {
    sandbox.restore();
  }
});

test('AuthService.register: deve lançar erro se email já existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(userRepository, 'emailExistsInAnyTenant').resolves(true);

    const authService = new AuthService();
    try {
      await authService.register({
        companyName: 'Test Company',
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

test('AuthService.register: deve lançar erro se dados obrigatórios estão faltando', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const authService = new AuthService();

    try {
      await authService.register({
        companyName: '',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.ok(error.message.includes('required'));
    }
  } finally {
    sandbox.restore();
  }
});

test('AuthService.login: deve fazer login com sucesso quando credenciais são válidas', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Company',
      slug: 'test-company',
      schemaName: 'tenant_test_company',
    };

    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(TenantService.prototype, 'findBySlug').resolves(mockTenant);
    sandbox.stub(userRepository, 'findUsersByEmailInSchema').resolves([mockUser]);

    const authService = new AuthService();
    const result = await authService.login({
      tenant: 'test-company',
      email: 'john@example.com',
      password: 'password123',
    });

    assert.ok(!('requiresTenantSelection' in result));
    if (!('requiresTenantSelection' in result)) {
      assert.equal(result.user.id, 'user-1');
      assert.equal(result.tenant.id, 'tenant-1');
      assert.ok(result.token);
    }
  } finally {
    sandbox.restore();
  }
});

test('AuthService.login: deve lançar erro se credenciais são inválidas', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Company',
      slug: 'test-company',
      schemaName: 'tenant_test_company',
    };

    sandbox.stub(TenantService.prototype, 'findBySlug').resolves(mockTenant);
    sandbox.stub(userRepository, 'findUsersByEmailInSchema').resolves([]);

    const authService = new AuthService();
    try {
      await authService.login({
        tenant: 'test-company',
        email: 'john@example.com',
        password: 'wrongpassword',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Invalid credentials');
    }
  } finally {
    sandbox.restore();
  }
});

test('AuthService.login: deve lançar erro se email ou senha estão faltando', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const authService = new AuthService();

    try {
      await authService.login({
        email: '',
        password: 'password123',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.ok(error.message.includes('required'));
    }
  } finally {
    sandbox.restore();
  }
});

test('AuthService.forgotPassword: deve enviar email de reset com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Company',
      slug: 'test-company',
      schemaName: 'tenant_test_company',
    };

    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      resetToken: null,
      resetTokenExpires: null,
      save: sandbox.stub().resolves(true),
    };

    sandbox.stub(TenantService.prototype, 'findBySlug').resolves(mockTenant);
    sandbox.stub(userRepository, 'findUsersByEmailInSchema').resolves([mockUser]);
    sandbox.stub(userRepository, 'getUserRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockUser),
      save: sandbox.stub().resolves(mockUser),
    } as any);

    const authService = new AuthService();
    const result = await authService.forgotPassword('test-company', 'john@example.com');

    assert.ok(result.message);
  } finally {
    sandbox.restore();
  }
});

test('AuthService.resetPassword: deve lançar erro se token está inválido', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(TenantService.prototype, 'findBySlug').resolves(null);

    const authService = new AuthService();
    try {
      await authService.resetPassword('test-company', 'invalid-token', 'newpassword123');
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Invalid or expired reset token');
    }
  } finally {
    sandbox.restore();
  }
});
