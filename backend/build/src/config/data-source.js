"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataSource = exports.AppDataSource = void 0;
exports.getDataSource = getDataSource;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config();
// ─────────────────────────────────────────────
// Importações explícitas das entidades
// (necessário para o TestDataSource com ts-jest)
// ─────────────────────────────────────────────
const Usuario_1 = require("../entities/Usuario");
const Campus_1 = require("../entities/Campus");
const Curso_1 = require("../entities/Curso");
const Categoria_1 = require("../entities/Categoria");
const Pergunta_1 = require("../entities/Pergunta");
const Alternativa_1 = require("../entities/Alternativa");
const PerguntaNivel_1 = require("../entities/PerguntaNivel");
const Quiz_1 = require("../entities/Quiz");
const Progresso_1 = require("../entities/Progresso");
const QuizAvalativoUsuario_1 = require("../entities/QuizAvalativoUsuario");
const Log_1 = require("../entities/Log");
const EmailToken_1 = require("../entities/EmailToken");
const ALL_ENTITIES = [
    Usuario_1.Usuario, Campus_1.Campus, Curso_1.Curso, Categoria_1.Categoria, Pergunta_1.Pergunta,
    Alternativa_1.Alternativa, PerguntaNivel_1.PerguntaNivel, Quiz_1.Quiz, Progresso_1.Progresso,
    QuizAvalativoUsuario_1.QuizAvalativoUsuario, Log_1.Log, EmailToken_1.EmailToken,
];
const MIGRATIONS = [path_1.default.join(__dirname, '..', '..', 'migrations', '*.{ts,js}')];
// ─────────────────────────────────────────────
// Opções de conexão PostgreSQL (produção/dev)
// ─────────────────────────────────────────────
const postgresOptions = process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: ALL_ENTITIES,
        migrations: MIGRATIONS,
        synchronize: false, // Nunca em produção
        logging: process.env.NODE_ENV === 'development',
    }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'quizgame',
        password: process.env.DB_PASSWORD || 'quizgame123',
        database: process.env.DB_NAME || 'quizgame',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        entities: ALL_ENTITIES,
        migrations: MIGRATIONS,
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
    };
/**
 * DataSource principal — PostgreSQL (dev / produção / Supabase).
 * Inicializado em src/index.ts antes de app.listen().
 */
exports.AppDataSource = new typeorm_1.DataSource(postgresOptions);
// ─────────────────────────────────────────────
// DataSource de Testes — SQLite in-memory
// ─────────────────────────────────────────────
/**
 * DataSource isolado para testes de integração.
 * Cria e destrói o schema automaticamente (synchronize: true).
 * Nunca toca no banco real.
 */
exports.TestDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: ALL_ENTITIES, // Classes diretas — sem glob
    synchronize: true,
    dropSchema: true,
    logging: false,
});
/**
 * Retorna o DataSource correto conforme NODE_ENV.
 * Usado pelos repositories e controllers.
 */
function getDataSource() {
    return process.env.NODE_ENV === 'test' ? exports.TestDataSource : exports.AppDataSource;
}
//# sourceMappingURL=data-source.js.map