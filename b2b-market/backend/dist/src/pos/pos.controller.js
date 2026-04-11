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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSController = void 0;
const common_1 = require("@nestjs/common");
const pos_service_1 = require("./pos.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_decorator_2 = require("../auth/roles.decorator");
let POSController = class POSController {
    posService;
    constructor(posService) {
        this.posService = posService;
    }
    async createSession(req, items) {
        return this.posService.createSession(req.user.userId, items);
    }
    async getStock(req) {
        return this.posService.getMyStock(req.user.userId);
    }
    async getSessions(req) {
        return this.posService.getSessions(req.user.userId);
    }
    async deleteSession(id) {
        return this.posService.deleteSession(+id);
    }
};
exports.POSController = POSController;
__decorate([
    (0, common_1.Post)('sessions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('items')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('stock'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "deleteSession", null);
exports.POSController = POSController = __decorate([
    (0, common_1.Controller)('pos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.RETAIL),
    __metadata("design:paramtypes", [pos_service_1.POSService])
], POSController);
//# sourceMappingURL=pos.controller.js.map