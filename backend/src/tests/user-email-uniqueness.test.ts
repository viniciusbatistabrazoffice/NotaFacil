import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { AddressInfo } from 'net';
import { app } from '../app';
import { AppDataSource } from '../database/data-source';
import { dropTenantSchema } from '../database/tenant-data-source';
import { toSchemaName } from '../utils/slug';

test('integração: e-mail duplicado retorna "Email already in use" (409)', async (t) => {
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

  async function createUser(token: string, body: Record<string, string>) {
    const res = await fetch(`${base}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json().catch(() => null) };
  }

  async function updateUser(token: string, id: string, body: Record<string, string>) {
    const res = await fetch(`${base}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json().catch(() => null) };
  }

  try {
    const a = await register(`dup-a-${ts}`, `admin-a-${ts}@test.com`);
    const b = await register(`dup-b-${ts}`, `shared-${ts}@test.com`);

    await t.test('cria usuário com e-mail novo', async () => {
      const res = await createUser(a.token, {
        name: 'Novo',
        email: `novo-${ts}@test.com`,
        password: 'senha12345',
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.email, `novo-${ts}@test.com`);
      assert.equal(res.body.password, undefined);
    });

    await t.test('rejeita e-mail já cadastrado na empresa', async () => {
      const res = await createUser(a.token, {
        name: 'Duplicado',
        email: `admin-a-${ts}@test.com`,
        password: 'senha12345',
      });
      assert.equal(res.status, 409);
      assert.equal(res.body.message, 'Email already in use');
    });

    await t.test('rejeita e-mail duplicado com caixa alta e espaços', async () => {
      const res = await createUser(a.token, {
        name: 'Duplicado',
        email: `  ADMIN-A-${ts}@TEST.COM  `,
        password: 'senha12345',
      });
      assert.equal(res.status, 409);
      assert.equal(res.body.message, 'Email already in use');
    });

    await t.test('rejeita o mesmo e-mail em outra empresa', async () => {
      const res = await createUser(a.token, {
        name: 'Compartilhado',
        email: `shared-${ts}@test.com`,
        password: 'senha12345',
      });
      assert.equal(res.status, 409);
      assert.equal(res.body.message, 'Email already in use');
    });

    await t.test('rejeita registro de nova empresa com e-mail já cadastrado', async () => {
      const res = await fetch(`${base}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: `dup-c-${ts}`,
          name: 'Admin',
          email: `admin-a-${ts}@test.com`,
          password: 'senha12345',
        }),
      });
      assert.equal(res.status, 409);
      const body = await res.json();
      assert.equal(body.message, 'Email already in use');
    });

    await t.test('rejeita update para e-mail de outro usuário', async () => {
      const user = await createUser(a.token, {
        name: 'U1',
        email: `u1-${ts}@test.com`,
        password: 'senha12345',
      });
      assert.equal(user.status, 201);

      const res = await updateUser(a.token, user.body.id, {
        email: `admin-a-${ts}@test.com`,
      });
      assert.equal(res.status, 409);
      assert.equal(res.body.message, 'Email already in use');
    });

    await t.test('permite update mantendo o próprio e-mail', async () => {
      const res = await updateUser(a.token, a.user.id, {
        name: 'Admin Renomeado',
        email: `admin-a-${ts}@test.com`,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'Admin Renomeado');
      assert.equal(res.body.email, `admin-a-${ts}@test.com`);
    });

    assert.ok(b.token);
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
