"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../shared/constants");
const Campus_1 = require("../entities/Campus");
const Curso_1 = require("../entities/Curso");
let Usuario = class Usuario {
    // ── Helpers ──────────────────────────────────────────────────────────────
    get isAdmin() {
        return this.role === constants_1.Role.SUPER_ADMIN || this.role === constants_1.Role.ADMIN;
    }
    get isCampusAdmin() {
        return this.role === constants_1.Role.CAMPUS_ADMIN;
    }
    /** Retorna objeto seguro sem senha. */
    toSafeJSON() {
        const { senha: _, ...safe } = this;
        void _;
        return safe;
    }
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', select: false }),
    __metadata("design:type", String)
], Usuario.prototype, "senha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: constants_1.Role.PLAYER }),
    __metadata("design:type", Number)
], Usuario.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "pontuacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: '' }),
    __metadata("design:type", Object)
], Usuario.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: '' }),
    __metadata("design:type", Object)
], Usuario.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Object)
], Usuario.prototype, "sexo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], Usuario.prototype, "datanascimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: '' }),
    __metadata("design:type", Object)
], Usuario.prototype, "uf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: '' }),
    __metadata("design:type", Object)
], Usuario.prototype, "cidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "turma", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "periodo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campusid', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Campus_1.Campus, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'campusid' }),
    __metadata("design:type", Object)
], Usuario.prototype, "campus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cursoid', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "cursoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Curso_1.Curso, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'cursoid' }),
    __metadata("design:type", Object)
], Usuario.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "emailVerified", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], Usuario);
//# sourceMappingURL=Usuario.js.map