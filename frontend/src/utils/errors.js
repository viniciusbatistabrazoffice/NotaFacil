const translations = {
  'Invalid credentials': 'E-mail ou senha inválidos.',
  'Email and password are required': 'E-mail e senha são obrigatórios.',
  'Email already in use': 'Este e-mail já está em uso.',
  'Use an email already registered in this company':
    'Use um e-mail já cadastrado nesta empresa.',
  'User not found': 'Usuário não encontrado.',
  'Invalid or expired reset token': 'Link de redefinição inválido ou expirado.',
  'Order not found': 'Pedido não encontrado.',
  'Invalid order status': 'Status de pedido inválido.',
  'Cannot delete your own account':
    'Você não pode excluir sua própria conta.',
  'Internal server error': 'Erro interno do servidor. Tente novamente.',
};

export function translateError(error) {
  return translations[error.message] ?? error.message;
}
