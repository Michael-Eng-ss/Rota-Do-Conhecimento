const { verifyToken } = require('../auth-utils');

/**
 * Middleware de autenticação — verifica JWT no header Authorization.
 * Anexa o payload decodificado em req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = header.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware de autorização por role.
 * Uso: requireRole(1) para admin.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
