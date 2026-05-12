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
exports.Progresso = void 0;
const typeorm_1 = require("typeorm");
let Progresso = class Progresso {
};
exports.Progresso = Progresso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Progresso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuarioid', type: 'int' }),
    __metadata("design:type", Number)
], Progresso.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'perguntaid', type: 'int' }),
    __metadata("design:type", Number)
], Progresso.prototype, "perguntaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'acertou', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Progresso.prototype, "acertou", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: true }),
    __metadata("design:type", Date)
], Progresso.prototype, "createdAt", void 0);
exports.Progresso = Progresso = __decorate([
    (0, typeorm_1.Entity)('progresso_perguntas')
], Progresso);
//# sourceMappingURL=Progresso.js.map