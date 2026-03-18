const router = require('express').Router();
const cursoController = require('../../controllers/curso.controller');
const { asyncHandler } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  res.json(await cursoController.getAll());
}));

module.exports = router;
