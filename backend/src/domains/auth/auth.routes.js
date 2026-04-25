const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const { asyncHandler, validateBody } = require('../../middlewares');

// Login
router.post('/', validateBody({ email: 'string', senha: 'string' }), asyncHandler(async (req, res) => {
  const result = await authController.login(req.body.email, req.body.senha);
  res.json(result);
}));

// Solicitar recuperação de senha (esqueci minha senha)
router.post('/esqueci-senha', validateBody({ email: 'string' }), asyncHandler(async (req, res) => {
  const result = await authController.forgotPassword(req.body.email);
  res.json(result);
}));

// Redefinir senha via token (enviado no link do e-mail)
router.post('/nova-senha', validateBody({ token: 'string', senha: 'string' }), asyncHandler(async (req, res) => {
  const result = await authController.resetPassword(req.body.token, req.body.senha);
  res.json(result);
}));

module.exports = router;
