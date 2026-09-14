import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import { ProductService } from '../services/product.service';
import * as productRepository from '../repositories/product.repository';

test('ProductService.findAll: deve retornar todos os produtos', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockProducts = [
      {
        id: 'prod-1',
        name: 'Product A',
        code: 'PROD-A',
        category: 'Category 1',
        price: 100.0,
        sizes: 'P, M, G',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'prod-2',
        name: 'Product B',
        code: 'PROD-B',
        category: 'Category 2',
        price: 200.0,
        sizes: 'P, M, G, GG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sandbox.stub(productRepository, 'getProductRepository').resolves({
      find: sandbox.stub().resolves(mockProducts),
    } as any);

    const productService = new ProductService();
    const result = await productService.findAll('tenant_test');

    assert.equal(result.length, 2);
    assert.equal(result[0].id, 'prod-1');
    assert.equal(result[0].name, 'Product A');
  } finally {
    sandbox.restore();
  }
});

test('ProductService.create: deve criar novo produto com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockProduct = {
      id: 'prod-1',
      name: 'Product A',
      code: 'PROD-A',
      category: 'Category 1',
      price: 100.0,
      sizes: 'P, M, G',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(productRepository, 'getProductRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
      create: sandbox.stub().returns(mockProduct),
      save: sandbox.stub().resolves(mockProduct),
    } as any);

    const productService = new ProductService();
    const result = await productService.create('tenant_test', {
      name: 'Product A',
      code: 'PROD-A',
      category: 'Category 1',
      price: 100.0,
      sizes: 'P, M, G',
    });

    assert.equal(result.id, 'prod-1');
    assert.equal(result.name, 'Product A');
    assert.equal(result.code, 'PROD-A');
  } finally {
    sandbox.restore();
  }
});

test('ProductService.create: deve normalizar entrada (trim e uppercase)', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockProduct = {
      id: 'prod-1',
      name: 'Product A',
      code: 'PROD-A',
      category: 'Category 1',
      price: 100.0,
      sizes: 'P, M, G',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createStub = sandbox.stub().returns(mockProduct);
    sandbox.stub(productRepository, 'getProductRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
      create: createStub,
      save: sandbox.stub().resolves(mockProduct),
    } as any);

    const productService = new ProductService();
    await productService.create('tenant_test', {
      name: '  Product A  ',
      code: '  prod-a  ',
      category: '  Category 1  ',
      price: 100.0,
      sizes: '  P, M, G  ',
    });

    const createdProduct = createStub.getCall(0).args[0];
    assert.equal(createdProduct.name, 'Product A');
    assert.equal(createdProduct.code, 'PROD-A');
  } finally {
    sandbox.restore();
  }
});

test('ProductService.create: deve lançar erro se campos obrigatórios estão faltando', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(productRepository, 'getProductRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
    } as any);

    const productService = new ProductService();
    try {
      await productService.create('tenant_test', {
        name: '',
        code: 'PROD-A',
        category: 'Category 1',
        price: 100.0,
        sizes: 'P, M, G',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.ok(error.message.includes('required'));
    }
  } finally {
    sandbox.restore();
  }
});

test('ProductService.create: deve lançar erro se preço é negativo', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(productRepository, 'getProductRepository').resolves({
      existsBy: sandbox.stub().resolves(false),
    } as any);

    const productService = new ProductService();
    try {
      await productService.create('tenant_test', {
        name: 'Product A',
        code: 'PROD-A',
        category: 'Category 1',
        price: -10.0,
        sizes: 'P, M, G',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Product price must be non-negative');
    }
  } finally {
    sandbox.restore();
  }
});

test('ProductService.create: deve lançar erro se código já existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(productRepository, 'getProductRepository').resolves({
      existsBy: sandbox.stub().resolves(true),
    } as any);

    const productService = new ProductService();
    try {
      await productService.create('tenant_test', {
        name: 'Product A',
        code: 'PROD-A',
        category: 'Category 1',
        price: 100.0,
        sizes: 'P, M, G',
      });
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Product code already in use');
    }
  } finally {
    sandbox.restore();
  }
});

test('ProductService.update: deve atualizar produto com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const existingProduct = {
      id: 'prod-1',
      name: 'Product A',
      code: 'PROD-A',
      category: 'Category 1',
      price: 100.0,
      sizes: 'P, M, G',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProduct = {
      ...existingProduct,
      name: 'Product A Updated',
      price: 150.0,
    };

    sandbox.stub(productRepository, 'getProductRepository').resolves({
      findOneBy: sandbox.stub().resolves(existingProduct),
      merge: sandbox.stub().returns(updatedProduct),
      save: sandbox.stub().resolves(updatedProduct),
    } as any);

    const productService = new ProductService();
    const result = await productService.update('tenant_test', 'prod-1', {
      name: 'Product A Updated',
      code: 'PROD-A',
      category: 'Category 1',
      price: 150.0,
      sizes: 'P, M, G',
    });

    assert.equal(result.id, 'prod-1');
    assert.equal(result.name, 'Product A Updated');
    assert.equal(result.price, 150.0);
  } finally {
    sandbox.restore();
  }
});

test('ProductService.delete: deve deletar produto com sucesso', async () => {
  const sandbox = sinon.createSandbox();
  try {
    const mockProduct = {
      id: 'prod-1',
      name: 'Product A',
      code: 'PROD-A',
      category: 'Category 1',
      price: 100.0,
      sizes: 'P, M, G',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox.stub(productRepository, 'getProductRepository').resolves({
      findOneBy: sandbox.stub().resolves(mockProduct),
      remove: sandbox.stub().resolves(undefined),
    } as any);

    const productService = new ProductService();
    await productService.delete('tenant_test', 'prod-1');
  } finally {
    sandbox.restore();
  }
});

test('ProductService.delete: deve lançar erro se produto não existe', async () => {
  const sandbox = sinon.createSandbox();
  try {
    sandbox.stub(productRepository, 'getProductRepository').resolves({
      findOneBy: sandbox.stub().resolves(null),
    } as any);

    const productService = new ProductService();
    try {
      await productService.delete('tenant_test', 'non-existent-id');
      assert.fail('Deveria ter lançado erro');
    } catch (error: any) {
      assert.equal(error.message, 'Product not found');
    }
  } finally {
    sandbox.restore();
  }
});
