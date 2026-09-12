const translations = {
  'Invalid credentials': 'Empresa, e-mail ou senha inválidos.',
  'Email already in use': 'Este e-mail já está em uso.',
  'User not found': 'Usuário não encontrado.',
  'Invalid or expired reset token': 'Link de redefinição inválido ou expirado.',
  'Order not found': 'Pedido não encontrado.',
  'Invalid order status': 'Status de pedido inválido.',
};

export function translateError(error) {
  return translations[error.message] ?? error.message;
}
