import { translateError } from './errors';

test('traduz "Email already in use" para português', () => {
  expect(translateError(new Error('Email already in use'))).toBe(
    'Este e-mail já está em uso.'
  );
});

test('mantém a mensagem original quando não há tradução', () => {
  expect(translateError(new Error('Unexpected failure'))).toBe('Unexpected failure');
});
