"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alternativaController = exports.AlternativaController = void 0;
const AlternativaService_1 = require("../services/AlternativaService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class AlternativaController {
    constructor() {
        /** GET /alternativas/pergunta/:perguntaId */
        this.getByPergunta = async (req, res) => {
            const perguntasid = parseInt(String(req.params.perguntaId));
            if (isNaN(perguntasid))
                throw AppError_1.AppError.badRequest('ID de pergunta inválido');
            const items = await this.service.getByPergunta(perguntasid);
            res.json(items);
        };
        /** POST /alternativas */
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        /** PUT /alternativas/:id */
        this.update = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const item = await this.service.update(id, req.body);
            res.json(item);
        };
        /** DELETE /alternativas/:id */
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new AlternativaService_1.AlternativaService((0, data_source_1.getDataSource)());
    }
}
exports.AlternativaController = AlternativaController;
exports.alternativaController = new AlternativaController();
//# sourceMappingURL=AlternativaController.js.map