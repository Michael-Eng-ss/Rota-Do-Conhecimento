"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursoController = exports.CursoController = void 0;
const CursoService_1 = require("../services/CursoService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class CursoController {
    constructor() {
        this.getAll = async (_req, res) => {
            const items = await this.service.getAll();
            res.json(items);
        };
        this.getById = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.getById(id);
            res.json(item);
        };
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        this.update = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.update(id, req.body);
            res.json(item);
        };
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new CursoService_1.CursoService((0, data_source_1.getDataSource)());
    }
}
exports.CursoController = CursoController;
exports.cursoController = new CursoController();
//# sourceMappingURL=CursoController.js.map