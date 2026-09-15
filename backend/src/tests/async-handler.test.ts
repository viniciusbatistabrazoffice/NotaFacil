import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { asyncHandler } from '../utils/async-handler';
import { Request, Response, NextFunction } from 'express';

test('asyncHandler: deve passar erros para o middleware de erro', async () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;
  const mockNext = ((error: Error) => {
    assert.ok(error);
    assert.equal(error.message, 'Test error');
  }) as NextFunction;

  const handler = asyncHandler(async (req, res) => {
    throw new Error('Test error');
  });

  await handler(mockReq, mockRes, mockNext);
});

test('asyncHandler: deve executar handler com sucesso sem erros', async () => {
  let executed = false;
  const mockReq = {} as Request;
  const mockRes = { json: () => {} } as Response;
  const mockNext = (() => {
    throw new Error('Should not be called');
  }) as NextFunction;

  const handler = asyncHandler(async (req, res) => {
    executed = true;
    res.json({ success: true });
  });

  await handler(mockReq, mockRes, mockNext);
  assert.ok(executed);
});

test('asyncHandler: deve passar erros síncronos em funções assíncronas para o middleware de erro', async () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;
  let errorCaught = false;
  const mockNext = ((error: Error) => {
    errorCaught = true;
    assert.ok(error);
    assert.equal(error.message, 'Async sync error');
  }) as NextFunction;

  const handler = asyncHandler(async (req, res) => {
    throw new Error('Async sync error');
  });

  await handler(mockReq, mockRes, mockNext);
  assert.ok(errorCaught, 'Error should have been caught and passed to next');
});
