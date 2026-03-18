const router = require('express').Router();
const campusController = require('../../controllers/campus.controller');
const { asyncHandler, requireAuth, requireRole, validateBody } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  res.json(await campusController.getAll());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await campusController.getById(req.params.id));
}));

router.post('/', requireAuth, requireRole(1), validateBody({ nomecampus: 'string' }), asyncHandler(async (req, res) => {
  const campus = await campusController.create(req.body.nomecampus);
  res.status(201).json(campus);
}));

router.put('/:id', requireAuth, requireRole(1), validateBody({ nomecampus: 'string' }), asyncHandler(async (req, res) => {
  res.json(await campusController.update(req.params.id, req.body.nomecampus));
}));

router.delete('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  await campusController.delete(req.params.id);
  res.status(204).send();
}));

module.exports = router;
