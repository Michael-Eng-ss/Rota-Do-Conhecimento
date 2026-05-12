"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = exports.UsuarioController = void 0;
const UsuarioService_1 = require("@/services/UsuarioService");
const AppError_1 = require("@/shared/AppError");
const data_source_1 = require("@/config/data-source");
class UsuarioController {
    constructor() {
        this.getById = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const user = await this.service.getById(id);
            res.json(user);
        };
        this.create = async (req, res) => {
            const user = await this.service.create(req.body);
            res.status(201).json(user);
        };
        this.update = async (req, res) => {
            const targetId = parseInt(String(req.params.id));
            if (isNaN(targetId))
                throw AppError_1.AppError.badRequest('ID inválido');
            if (!UsuarioService_1.UsuarioService.canEditUser(req.user.id, req.user.role, targetId)) {
                throw AppError_1.AppError.forbidden('Sem permissão para editar este perfil');
            }
            const user = await this.service.update(targetId, req.body);
            res.json(user);
        };
        this.updatePassword = async (req, res) => {
            const targetId = parseInt(String(req.params.id));
            if (isNaN(targetId))
                throw AppError_1.AppError.badRequest('ID inválido');
            if (!UsuarioService_1.UsuarioService.canEditUser(req.user.id, req.user.role, targetId)) {
                throw AppError_1.AppError.forbidden('Sem permissão para alterar esta senha');
            }
            const result = await this.service.updatePassword(targetId, req.body.senha);
            res.json(result);
        };
        this.updateScore = async (req, res) => {
            const targetId = parseInt(String(req.params.id));
            if (isNaN(targetId))
                throw AppError_1.AppError.badRequest('ID inválido');
            if (!UsuarioService_1.UsuarioService.canEditUser(req.user.id, req.user.role, targetId)) {
                throw AppError_1.AppError.forbidden('Sem permissão para atualizar esta pontuação');
            }
            const delta = Number(req.body.pontuacao);
            if (isNaN(delta))
                throw AppError_1.AppError.badRequest('Pontuação inválida');
            const user = await this.service.updateScore(targetId, delta);
            res.json(user);
        };
        this.findByCurso = async (req, res) => {
            const cursoId = parseInt(String(req.params.cursoId));
            const skip = parseInt(String(req.query.skip ?? '0'));
            const take = parseInt(String(req.query.take ?? '20'));
            if (isNaN(cursoId))
                throw AppError_1.AppError.badRequest('cursoId inválido');
            const users = await this.service.findByCurso(cursoId, skip, take);
            res.json(users);
        };
        this.service = new UsuarioService_1.UsuarioService((0, data_source_1.getDataSource)());
    }
}
exports.UsuarioController = UsuarioController;
exports.usuarioController = new UsuarioController();
//# sourceMappingURL=UsuarioController.js.map