"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./domains/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./domains/users/users.routes"));
const admin_routes_1 = __importDefault(require("./domains/admin/admin.routes"));
const ranking_routes_1 = __importDefault(require("./domains/ranking/ranking.routes"));
const campus_routes_1 = __importDefault(require("./domains/campus/campus.routes"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
exports.app = app;
// ── CORS ──────────────────────────────────────────────────────────────────
const corsOptions = {
    origin: (origin, callback) => callback(null, origin || '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
// ── Body + Logger ─────────────────────────────────────────────────────────
app.use(express_1.default.json());
app.use(middlewares_1.requestLogger);
// ── Rotas ─────────────────────────────────────────────────────────────────
app.use('/auth', auth_routes_1.default);
app.use('/usuarios', users_routes_1.default);
app.use('/admin', admin_routes_1.default);
app.use('/ranking', ranking_routes_1.default);
app.use('/campus', campus_routes_1.default);
// ── Error Handlers ────────────────────────────────────────────────────────
app.use(middlewares_1.notFoundHandler);
app.use(middlewares_1.errorHandler);
//# sourceMappingURL=app.js.map