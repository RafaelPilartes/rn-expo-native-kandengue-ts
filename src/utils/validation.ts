export function validateUser(user: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!user.name?.trim()) errors.push('Nome é obrigatório');
  if (!user.email?.trim()) errors.push('Email é obrigatório');
  if (!user.phone?.trim()) errors.push('Telefone é obrigatório');
  if (!user.validateEmail(user.email)) errors.push('Email inválido');
  if (user.password && user.password.length < 6)
    errors.push('Senha deve ter pelo menos 6 caracteres');

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
