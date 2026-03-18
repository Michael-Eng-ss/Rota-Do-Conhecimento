const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const { asyncHandler, validateBody } = require('../../middlewares');

router.post('/', validateBody({ email: 'string', senha: 'string' }), asyncHandler(async (req, res) => {
  const result = await authController.login(req.body.email, req.body.senha);
  res.json(result);
}));

module.exports = router;
