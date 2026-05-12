"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const AdminService_1 = require("@/services/AdminService");
const AppError_1 = require("@/shared/AppError");
const constants_1 = require("@/shared/constants");
const data_source_1 = require("@/config/data-source");
class AdminController {
    constructor() {
        /** POST /admin/admins — cria novo admin (SUPER_ADMIN only). */
        this.createAdmin = async (req, res) => {
            const user = await this.service.createAdmin(req.body, req.user);
            res.status(201).json(user);
        };
        /** PUT /admin/usuarios/:id/role — promove usuário (SUPER_ADMIN only). */
        this.promoteUser = async (req, res) => {
            const targetId = parseInt(String(req.params.id));
            if (isNaN(targetId))
                throw AppError_1.AppError.badRequest('ID inválido');
            const { role } = req.body;
            if (!Object.values(constants_1.Role).includes(role))
                throw AppError_1.AppError.badRequest('Role inválida');
            const result = await this.service.promoteUser(targetId, role, req.user);
            res.json(result);
        };
        /** GET /admin/usuarios — lista todos os usuários. */
        this.listAll = async (_req, res) => {
            const users = await this.service.listAll();
            res.json(users);
        };
        /** GET /admin/campus/:id/usuarios — lista usuários do campus. */
        this.listByCampus = async (req, res) => {
            const campusId = parseInt(String(req.params.id));
            if (isNaN(campusId))
                throw AppError_1.AppError.badRequest('campusId inválido');
            const users = await this.service.listByCampus(campusId);
            res.json(users);
        };
        this.service = new AdminService_1.AdminService((0, data_source_1.getDataSource)());
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=AdminController.js.map