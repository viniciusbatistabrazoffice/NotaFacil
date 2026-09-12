import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page when unauthenticated', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /notafácil/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});
