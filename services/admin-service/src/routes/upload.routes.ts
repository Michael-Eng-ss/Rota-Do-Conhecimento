import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { asyncHandler, requireAuth, requireAdmin } from '../../middlewares';
import { AppError } from '../../shared/AppError';

// ── Diretório de uploads ───────────────────────────────────────────────────
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Configuração Multer (disco local) ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}. Use: JPEG, PNG, GIF, WebP ou SVG.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

/**
 * POST /upload
 * Recebe um arquivo de imagem via multipart/form-data (campo "imagem").
 * Retorna a URL relativa para acesso ao arquivo.
 */
router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.single('imagem'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw AppError.badRequest('Nenhum arquivo enviado. Use o campo "imagem".');
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
      message: 'Upload realizado com sucesso',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  }),
);

/**
 * DELETE /upload/:filename
 * Remove um arquivo previamente enviado.
 */
router.delete(
  '/:filename',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, String(filename));

    // Prevenir path traversal
    if (!filePath.startsWith(UPLOAD_DIR)) {
      throw AppError.forbidden('Acesso negado');
    }

    if (!fs.existsSync(filePath)) {
      throw AppError.notFound('Arquivo não encontrado');
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Arquivo removido com sucesso' });
  }),
);

export default router;
