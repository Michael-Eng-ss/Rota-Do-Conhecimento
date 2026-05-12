"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankingController = exports.RankingController = void 0;
const RankingService_1 = require("../services/RankingService");
const AppError_1 = require("../shared/AppError");
const data_source_1 = require("../config/data-source");
class RankingController {
    constructor() {
        /** GET /ranking?limit=100 */
        this.getGlobal = async (req, res) => {
            const limit = parseInt(req.query.limit || '100');
            const ranking = await this.service.getGlobalRanking(limit);
            res.json(ranking);
        };
        /** GET /ranking/curso/:cursoId?limit=50 */
        this.getByCurso = async (req, res) => {
            const cursoId = parseInt(String(req.params.cursoId));
            if (isNaN(cursoId))
                throw AppError_1.AppError.badRequest('cursoId inválido');
            const limit = parseInt(String(req.query.limit ?? '50'));
            const ranking = await this.service.getRankingByCurso(cursoId, limit);
            res.json(ranking);
        };
        /** GET /ranking/campus/:campusId?limit=50 */
        this.getByCampus = async (req, res) => {
            const campusId = parseInt(String(req.params.campusId));
            if (isNaN(campusId))
                throw AppError_1.AppError.badRequest('campusId inválido');
            const limit = parseInt(String(req.query.limit ?? '50'));
            const ranking = await this.service.getRankingByCampus(campusId, limit);
            res.json(ranking);
        };
        this.service = new RankingService_1.RankingService((0, data_source_1.getDataSource)());
    }
}
exports.RankingController = RankingController;
exports.rankingController = new RankingController();
//# sourceMappingURL=RankingController.js.map