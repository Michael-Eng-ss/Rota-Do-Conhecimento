const router = require('express').Router();
const quizAvaliativoController = require('../../controllers/quiz-avaliativo.controller');
const { asyncHandler, requireAuth } = require('../../middlewares');

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const result = await quizAvaliativoController.create(req.body);
  res.status(201).json(result);
}));

router.get('/quiz/:quizId/:skip/:take', asyncHandler(async (req, res) => {
  res.json(await quizAvaliativoController.getByQuiz(req.params.quizId, req.params.skip, req.params.take));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await quizAvaliativoController.getById(req.params.id));
}));

module.exports = router;
