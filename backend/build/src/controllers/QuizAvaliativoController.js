"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizAvaliativoController = exports.QuizAvaliativoController = void 0;
const QuizAvaliativoService_1 = require("../services/QuizAvaliativoService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class QuizAvaliativoController {
    constructor() {
        /** GET /quiz-avaliativo/usuario/:userId */
        this.getByUsuario = async (req, res) => {
            const usuarioid = parseInt(String(req.params.userId));
            if (isNaN(usuarioid))
                throw AppError_1.AppError.badRequest('ID inválido');
            const items = await this.service.getByUsuario(usuarioid);
            res.json(items);
        };
        /** GET /quiz-avaliativo/quiz/:quizId */
        this.getByQuiz = async (req, res) => {
            const quizid = parseInt(String(req.params.quizId));
            if (isNaN(quizid))
                throw AppError_1.AppError.badRequest('ID inválido');
            const items = await this.service.getByQuiz(quizid);
            res.json(items);
        };
        /** POST /quiz-avaliativo */
        this.create = async (req, res) => {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        };
        /** DELETE /quiz-avaliativo/:id */
        this.delete = async (req, res) => {
            const id = parseInt(String(req.params.id));
            if (isNaN(id))
                throw AppError_1.AppError.badRequest('ID inválido');
            const result = await this.service.delete(id);
            res.json(result);
        };
        this.service = new QuizAvaliativoService_1.QuizAvaliativoService((0, data_source_1.getDataSource)());
    }
}
exports.QuizAvaliativoController = QuizAvaliativoController;
exports.quizAvaliativoController = new QuizAvaliativoController();
//# sourceMappingURL=QuizAvaliativoController.js.map