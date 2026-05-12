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
exports.Quiz = void 0;
const typeorm_1 = require("typeorm");
const Curso_1 = require("./Curso");
const Usuario_1 = require("./Usuario");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Quiz.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Quiz.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cursoid', type: 'int' }),
    __metadata("design:type", Number)
], Quiz.prototype, "cursoid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Quiz.prototype, "imagem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Quiz.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Quiz.prototype, "avaliativo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuarioid', type: 'int' }),
    __metadata("design:type", Number)
], Quiz.prototype, "usuarioid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Curso_1.Curso, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'cursoid' }),
    __metadata("design:type", Curso_1.Curso)
], Quiz.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioid' }),
    __metadata("design:type", Usuario_1.Usuario)
], Quiz.prototype, "usuario", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typeorm_1.Entity)('quiz')
], Quiz);
//# sourceMappingURL=Quiz.js.map