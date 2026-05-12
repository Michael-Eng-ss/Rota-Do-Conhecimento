"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressoController = exports.ProgressoController = void 0;
const ProgressoService_1 = require("../services/ProgressoService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class ProgressoController {
    constructor() {
        /** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
        this.getByQuizAndUsuario = async (req, res) => {
            const quizid = parseInt(String(req.params.quizId));
            const usuariosid = parseInt(String(req.params.userId));
            if (isNaN(quizid) || isNaN(usuariosid))
                throw AppError_1.AppError.badRequest('IDs inválidos');
            const items = await this.service.getByQuizAndUsuario(quizid, usuariosid);
            res.json(items);
        };
        /** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
        this.getByCategQuizAndUsuario = async (req, res) => {
            const categoriasid = parseInt(String(req.params.catId));
            const quizid = parseInt(String(req.params.quizId));
            const usuariosid = parseInt(String(req.params.userId));
            if (isNaN(categoriasid) || isNaN(quizid) || isNaN(usuariosid))
                throw AppError_1.AppError.badRequest('IDs inválidos');
            const items = await this.service.getByCategQuizAndUsuario(categoriasid, quizid, usuariosid);
            res.json(items);
        };
        /** POST /progresso-perguntas */
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        this.service = new ProgressoService_1.ProgressoService((0, data_source_1.getDataSource)());
    }
}
exports.ProgressoController = ProgressoController;
exports.progressoController = new ProgressoController();
//# sourceMappingURL=ProgressoController.js.map