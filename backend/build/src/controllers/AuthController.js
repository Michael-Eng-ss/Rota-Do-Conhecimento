"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const data_source_1 = require("../config/data-source");
class AuthController {
    constructor() {
        this.login = async (req, res) => {
            const { email, senha } = req.body;
            const result = await this.service.login(email, senha);
            res.json(result);
        };
        this.forgotPassword = async (req, res) => {
            const { email } = req.body;
            const result = await this.service.forgotPassword(email);
            res.json(result);
        };
        this.resetPassword = async (req, res) => {
            const { token, senha } = req.body;
            const result = await this.service.resetPassword(token, senha);
            res.json(result);
        };
        this.service = new AuthService_1.AuthService((0, data_source_1.getDataSource)());
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map