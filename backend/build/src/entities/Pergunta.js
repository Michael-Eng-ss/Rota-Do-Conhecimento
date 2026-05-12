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
exports.Pergunta = void 0;
const typeorm_1 = require("typeorm");
const Categoria_1 = require("./Categoria");
const Alternativa_1 = require("./Alternativa");
const Campus_1 = require("./Campus");
let Pergunta = class Pergunta {
};
exports.Pergunta = Pergunta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pergunta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Pergunta.prototype, "enunciado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "dificuldade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'categoriaid', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "categoriaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Categoria_1.Categoria, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaid' }),
    __metadata("design:type", Object)
], Pergunta.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campusid', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Campus_1.Campus, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'campusid' }),
    __metadata("design:type", Object)
], Pergunta.prototype, "campus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Pergunta.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: true }),
    __metadata("design:type", Date)
], Pergunta.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Alternativa_1.Alternativa, (a) => a.pergunta),
    __metadata("design:type", Array)
], Pergunta.prototype, "alternativas", void 0);
exports.Pergunta = Pergunta = __decorate([
    (0, typeorm_1.Entity)('perguntas')
], Pergunta);
//# sourceMappingURL=Pergunta.js.map