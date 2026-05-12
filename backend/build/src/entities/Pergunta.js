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
const PerguntaNivel_1 = require("./PerguntaNivel");
const Quiz_1 = require("./Quiz");
let Pergunta = class Pergunta {
};
exports.Pergunta = Pergunta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pergunta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "conteudo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'perguntasnivelid', type: 'int' }),
    __metadata("design:type", Number)
], Pergunta.prototype, "perguntasnivelid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 30 }),
    __metadata("design:type", Number)
], Pergunta.prototype, "tempo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pathimage', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "pathimage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Pergunta.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'categoriasid', type: 'int' }),
    __metadata("design:type", Number)
], Pergunta.prototype, "categoriasid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quizid', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Pergunta.prototype, "quizid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Categoria_1.Categoria, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'categoriasid' }),
    __metadata("design:type", Categoria_1.Categoria)
], Pergunta.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PerguntaNivel_1.PerguntaNivel, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'perguntasnivelid' }),
    __metadata("design:type", PerguntaNivel_1.PerguntaNivel)
], Pergunta.prototype, "nivel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quiz_1.Quiz, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'quizid' }),
    __metadata("design:type", Object)
], Pergunta.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Alternativa_1.Alternativa, (a) => a.pergunta),
    __metadata("design:type", Array)
], Pergunta.prototype, "alternativas", void 0);
exports.Pergunta = Pergunta = __decorate([
    (0, typeorm_1.Entity)('perguntas')
], Pergunta);
//# sourceMappingURL=Pergunta.js.map