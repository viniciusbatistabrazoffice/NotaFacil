import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { AddressInfo } from 'net';
import { app } from '../app';
import { AppDataSource } from '../database/data-source';
import { dropTenantSchema } from '../database/tenant-data-source';
import { authMiddleware } from '../middlewares/auth.middleware';
import { signToken } from '../utils/jwt';
import { toSchemaName } from '../utils/slug';
import { env } from '../config/env';

const SCHEMA_A = 'tenant_iso_unit_a';
const SCHEMA_B = 'tenant_iso_unit_b';

function mockContext(authorization?: string, query = {}, headers = {}) {
  const req: any = { headers: { ...headers, ...(authorization ? { authorization } : {}) }, query };
  const res: any = {
    statusCode: 0,
    body: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: any) {
      this.body = body;
      return this;
    },
  };
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };
  return { req, res, next, wasNextCalled: () => nextCalled };
}

test('authMiddleware: token da empresa A resolve o schema A mesmo com tentativa de override', () => {
  const token = signToken({ sub: 'user-a', tenantId: 'tenant-a', schema: SCHEMA_A });
  const { req, res, next, wasNextCalled } = mockContext(
    `Bearer ${token}`,
    { schema: SCHEMA_B, tenant: 'empresa-b' },
    { 'x-tenant': SCHEMA_B },
  );

  authMiddleware(req, res, next);

  assert.equal(wasNextCalled(), true);
  assert.equal(req.tenantSchema, SCHEMA_A);
  assert.equal(req.tenantId, 'tenant-a');
});

test('authMiddleware: token forjado para o schema da empresa B é rejeitado', () => {
  const forged = jwt.sign(
    { sub: 'user-x', tenantId: 'tenant-b', schema: SCHEMA_B },
    'segredo-errado',
  );
  const { req, res, next, wasNextCalled } = mockContext(`Bearer ${forged}`);

  authMiddleware(req, res, next);

  assert.equal(wasNextCalled(), false);
  assert.equal(res.statusCode, 401);
});

test('authMiddleware: requisição sem token é rejeitada', () => {
  const { req, res, next, wasNextCalled } = mockContext();

  authMiddleware(req, res, next);

  assert.equal(wasNextCalled(), false);
  assert.equal(res.statusCode, 401);
});

test('integração: usuário da empresa A não acessa dados da empresa B', async (t) => {
  await AppDataSource.initialize();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://localhost:${(server.address() as AddressInfo).port}`;

  const ts = Date.now();
  const created: Array<{ tenantId: string; schemaName: string }> = [];

  async function register(company: string, email: string) {
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: company, name: 'Admin', email, password: 'senha12345' }),
    });
    const text = await res.text();
    assert.equal(res.status, 201, text);
    const data = JSON.parse(text);
    created.push({ tenantId: data.tenant.id, schemaName: toSchemaName(data.tenant.slug) });
    return data;
  }

  async function getUsers(token: string, extra = '') {
    const res = await fetch(`${base}/users${extra}`, {
      headers: { Authorization: `Bearer ${token}`, 'X-Tenant': 'tenant_iso_b' },
    });
    return { status: res.status, body: await res.json().catch(() => null) };
  }

  try {
    const a = await register(`iso-a-${ts}`, `iso-a-${ts}@test.com`);
    const b = await register(`iso-b-${ts}`, `iso-b-${ts}@test.com`);
    const schemaB = toSchemaName(b.tenant.slug);

    const usersA = await getUsers(a.token);
    assert.equal(usersA.status, 200);
    assert.ok(Array.isArray(usersA.body));
    assert.ok(usersA.body.every((u: any) => u.email === `iso-a-${ts}@test.com`));
    assert.ok(!usersA.body.some((u: any) => u.email === `iso-b-${ts}@test.com`));

    const override = await getUsers(a.token, `?schema=${schemaB}&tenant=${b.tenant.slug}`);
    assert.equal(override.status, 200);
    assert.ok(Array.isArray(override.body));
    assert.ok(override.body.every((u: any) => u.email === `iso-a-${ts}@test.com`));

    const byId = await fetch(`${base}/users/${b.user.id}`, {
      headers: { Authorization: `Bearer ${a.token}` },
    });
    assert.equal(byId.status, 404);

    const forged = jwt.sign(
      { sub: 'x', tenantId: b.tenant.id, schema: schemaB },
      'segredo-errado',
      { expiresIn: '1h' },
    );
    const res = await fetch(`${base}/users`, {
      headers: { Authorization: `Bearer ${forged}` },
    });
    assert.equal(res.status, 401);
  } finally {
    for (const c of created) {
      await dropTenantSchema(c.schemaName).catch(() => {});
      await AppDataSource.query('DELETE FROM public.tenants WHERE id = $1', [c.tenantId]).catch(
        () => {},
      );
    }
    server.close();
    await AppDataSource.destroy();
  }
});
