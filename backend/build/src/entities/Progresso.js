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
const Usuario_1 = require("./Usuario");
const Pergunta_1 = require("./Pergunta");
let Progresso = class Progresso {
};
exports.Progresso = Progresso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Progresso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuariosid', type: 'int' }),
    __metadata("design:type", Number)
], Progresso.prototype, "usuariosid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'perguntasid', type: 'int' }),
    __metadata("design:type", Number)
], Progresso.prototype, "perguntasid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuariosid' }),
    __metadata("design:type", Usuario_1.Usuario)
], Progresso.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Pergunta_1.Pergunta, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'perguntasid' }),
    __metadata("design:type", Pergunta_1.Pergunta)
], Progresso.prototype, "pergunta", void 0);
exports.Progresso = Progresso = __decorate([
    (0, typeorm_1.Entity)('progressoperguntas')
], Progresso);
//# sourceMappingURL=Progresso.js.map