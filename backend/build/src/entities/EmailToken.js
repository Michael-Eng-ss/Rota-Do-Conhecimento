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
exports.EmailToken = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../shared/constants");
let EmailToken = class EmailToken {
};
exports.EmailToken = EmailToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmailToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id', type: 'int' }),
    __metadata("design:type", Number)
], EmailToken.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 512, unique: true }),
    __metadata("design:type", String)
], EmailToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], EmailToken.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expira_em', type: 'datetime' }),
    __metadata("design:type", Date)
], EmailToken.prototype, "expiraEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usado', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EmailToken.prototype, "usado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], EmailToken.prototype, "createdAt", void 0);
exports.EmailToken = EmailToken = __decorate([
    (0, typeorm_1.Entity)('email_tokens')
], EmailToken);
//# sourceMappingURL=EmailToken.js.map