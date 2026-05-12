"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campusController = exports.CampusController = void 0;
const CampusService_1 = require("../services/CampusService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class CampusController {
    constructor() {
        this.getAll = async (_req, res) => {
            const items = await this.service.getAll();
            res.json(items);
        };
        this.getById = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const campus = await this.service.getById(id);
            res.json(campus);
        };
        this.create = async (req, res) => {
            const { nome } = req.body;
            if (!nome?.trim())
                throw AppError_1.AppError.badRequest('Nome do campus é obrigatório');
            const campus = await this.service.create(nome.trim());
            res.status(201).json(campus);
        };
        this.update = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const { nome } = req.body;
            if (!nome?.trim())
                throw AppError_1.AppError.badRequest('Nome do campus é obrigatório');
            const campus = await this.service.update(id, nome.trim());
            res.json(campus);
        };
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new CampusService_1.CampusService((0, data_source_1.getDataSource)());
    }
}
exports.CampusController = CampusController;
exports.campusController = new CampusController();
//# sourceMappingURL=CampusController.js.map