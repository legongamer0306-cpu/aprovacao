// Configuração centralizada de segurança e autenticação do administrador
// Senha atual configurada a pedido do usuário (facilmente alterável para produção)
export const ADMIN_MASTER_PASSWORD = 'admin03061983';

export const ADMIN_IDENTIFIERS = [
  'admin',
  'superadmin',
  'admin@aprovacaototal.com',
  'pedagogico@aprovacaototal.com',
  'legongamer0306@gmail.com',
];

/**
 * Validação rigorosa da senha de administrador.
 * NUNCA aceita senhas genéricas ou apenas comprimento >= 6.
 * Exige estritamente a senha cadastrada ADMIN_MASTER_PASSWORD ('admin03061983').
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password.trim() === ADMIN_MASTER_PASSWORD;
}

/**
 * Verifica se um e-mail ou identificador digitado corresponde a uma conta administrativa.
 */
export function isAdminIdentifier(emailOrId: string): boolean {
  if (!emailOrId) return false;
  const normalized = emailOrId.trim().toLowerCase();
  return ADMIN_IDENTIFIERS.some((adm) => adm.toLowerCase() === normalized);
}
