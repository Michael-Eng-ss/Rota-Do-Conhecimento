import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { asyncHandler, validateBody } from '../middlewares';

const router = Router();

/**
 * POST /auth
 * Login — retorna { token, role, campusId, user }.
 * O frontend usa `role` para redirecionar ao painel correto.
 * A tela de admin é acessada diretamente pela URL (sem botão no front).
 */
router.post(
  '/',
  validateBody({ email: 'string', senha: 'string' }),
  asyncHandler(authController.login),
);

/**
 * POST /auth/esqueci-senha
 * Inicia o fluxo de recuperação de senha por e-mail.
 */
router.post(
  '/esqueci-senha',
  validateBody({ email: 'string' }),
  asyncHandler(authController.forgotPassword),
);

/**
 * POST /auth/nova-senha
 * Conclui a redefinição de senha com o token recebido por e-mail.
 */
router.post(
  '/nova-senha',
  validateBody({ token: 'string', senha: 'string' }),
  asyncHandler(authController.resetPassword),
);

/**
 * POST /auth/verificar-email
 * Valida o e-mail do usuário recém-cadastrado.
 */
router.post(
  '/verificar-email',
  validateBody({ token: 'string' }),
  asyncHandler(authController.verifyEmail),
);

export default router;
