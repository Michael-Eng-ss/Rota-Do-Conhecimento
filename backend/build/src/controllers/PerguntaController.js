"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perguntaController = exports.PerguntaController = void 0;
const PerguntaService_1 = require("../services/PerguntaService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class PerguntaController {
    constructor() {
        /** GET /perguntas/todas */
        this.getAll = async (_req, res) => {
            const items = await this.service.getAll();
            res.json(items);
        };
        /** GET /perguntas/completas/:categoriaId?active=false */
        this.getCompletas = async (req, res) => {
            const categoriasid = parseInt(String(req.params.categoriaId));
            if (isNaN(categoriasid))
                throw AppError_1.AppError.badRequest('ID de categoria inválido');
            const activeOnly = req.query.active !== 'false';
            const items = await this.service.getCompletas(categoriasid, activeOnly);
            res.json(items);
        };
        /** GET /perguntas/:id */
        this.getById = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.getById(id);
            res.json(item);
        };
        /** POST /perguntas */
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        /** PUT /perguntas/:id */
        this.update = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.update(id, req.body);
            res.json(item);
        };
        /** DELETE /perguntas/:id */
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new PerguntaService_1.PerguntaService((0, data_source_1.getDataSource)());
    }
}
exports.PerguntaController = PerguntaController;
exports.perguntaController = new PerguntaController();
//# sourceMappingURL=PerguntaController.js.map