import { render, screen } from '@testing-library/react';
import App from './App';

test('redireciona para a página de login quando não autenticado', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument();
});
