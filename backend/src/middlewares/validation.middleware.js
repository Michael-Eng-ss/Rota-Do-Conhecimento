/**
 * Middleware de validação de body.
 * Recebe um objeto com campos obrigatórios e seus tipos esperados.
 *
 * Uso:
 *   validateBody({ email: 'string', senha: 'string' })
 *   validateBody({ pontuacao: 'number' })
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, type] of Object.entries(schema)) {
      const value = req.body[field];

      if (value === undefined || value === null || value === '') {
        errors.push(`Campo '${field}' é obrigatório`);
      } else if (typeof value !== type) {
        errors.push(`Campo '${field}' deve ser do tipo ${type}, recebeu ${typeof value}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors,
      });
    }

    next();
  };
}

module.exports = { validateBody };
