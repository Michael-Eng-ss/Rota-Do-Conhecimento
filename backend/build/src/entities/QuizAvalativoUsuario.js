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
exports.QuizAvalativoUsuario = void 0;
const typeorm_1 = require("typeorm");
const Quiz_1 = require("./Quiz");
const Usuario_1 = require("./Usuario");
let QuizAvalativoUsuario = class QuizAvalativoUsuario {
};
exports.QuizAvalativoUsuario = QuizAvalativoUsuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuizAvalativoUsuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quizid', type: 'int' }),
    __metadata("design:type", Number)
], QuizAvalativoUsuario.prototype, "quizid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuarioid', type: 'int' }),
    __metadata("design:type", Number)
], QuizAvalativoUsuario.prototype, "usuarioid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], QuizAvalativoUsuario.prototype, "pontuacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'horainicial', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], QuizAvalativoUsuario.prototype, "horainicial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'horafinal', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], QuizAvalativoUsuario.prototype, "horafinal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quiz_1.Quiz, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'quizid' }),
    __metadata("design:type", Quiz_1.Quiz)
], QuizAvalativoUsuario.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioid' }),
    __metadata("design:type", Usuario_1.Usuario)
], QuizAvalativoUsuario.prototype, "usuario", void 0);
exports.QuizAvalativoUsuario = QuizAvalativoUsuario = __decorate([
    (0, typeorm_1.Entity)('quiz_avaliativo_usuario')
], QuizAvalativoUsuario);
//# sourceMappingURL=QuizAvalativoUsuario.js.map