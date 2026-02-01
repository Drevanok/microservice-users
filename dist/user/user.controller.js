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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const user_service_1 = require("./user.service");
const constants_1 = require("../common/constants");
const microservices_1 = require("@nestjs/microservices");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    createUser(userDto) {
        return this.userService.createUser(userDto);
    }
    findAllUsers() {
        return this.userService.findAllUsers();
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    updateUser(payload) {
        const { id, ...userDto } = payload;
        return this.userService.updateUser(id, userDto);
    }
    deleteUser(id) {
        return this.userService.deleteUser(id);
    }
    async validateUser(payload) {
        const user = await this.userService.findByUsername(payload.username);
        if (!user)
            return null;
        const isValidPass = await this.userService.checkPassword(payload.password, user.password);
        if (user && isValidPass)
            return user;
        return null;
    }
};
exports.UserController = UserController;
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.CREATE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.FIND_ALL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAllUsers", null);
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.FIND_ONE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.UPDATE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.DELETE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, microservices_1.MessagePattern)(constants_1.UserMSG.VALID_USER),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "validateUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map