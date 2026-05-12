"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaController = exports.CategoriaController = void 0;
const CategoriaService_1 = require("../services/CategoriaService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class CategoriaController {
    constructor() {
        /** GET /categorias */
        this.getAll = async (_req, res) => {
            const items = await this.service.getAll();
            res.json(items);
        };
        /** GET /categorias/curso/:cursoId */
        this.getByCurso = async (req, res) => {
            const cursoid = parseInt(String(req.params.cursoId));
            if (isNaN(cursoid))
                throw AppError_1.AppError.badRequest('ID de curso inválido');
            const items = await this.service.getByCurso(cursoid);
            res.json(items);
        };
        /** GET /categorias/:id */
        this.getById = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.getById(id);
            res.json(item);
        };
        /** POST /categorias */
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        /** PUT /categorias/:id */
        this.update = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.update(id, req.body);
            res.json(item);
        };
        /** DELETE /categorias/:id */
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new CategoriaService_1.CategoriaService((0, data_source_1.getDataSource)());
    }
}
exports.CategoriaController = CategoriaController;
exports.categoriaController = new CategoriaController();
//# sourceMappingURL=CategoriaController.js.map