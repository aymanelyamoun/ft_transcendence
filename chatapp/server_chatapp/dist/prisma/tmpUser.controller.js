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
exports.TmpUserController = void 0;
const common_1 = require("@nestjs/common");
const tmpUserAdd_service_1 = require("./tmpUserAdd.service");
let TmpUserController = class TmpUserController {
    constructor(tmpUserAddService) {
        this.tmpUserAddService = tmpUserAddService;
    }
    async addUser(data) {
        console.log(data);
        const user = await this.tmpUserAddService.createTmpUser(data);
        console.log(user);
    }
    async makeFriendship({ id, username }) {
        const user1 = await this.tmpUserAddService.getTmpUser({ where: { username: username } });
        const user = await this.tmpUserAddService.getTmpUser({ where: { id: id } });
        try {
            const [user1Friends, user2Friends] = await this.tmpUserAddService.makeFriendship(user, user1);
        }
        catch {
            throw new common_1.HttpException("user have ths friend", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeFriendship({ id, username }) {
        const user1 = await this.tmpUserAddService.getTmpUser({ where: { username: username } });
        const user = await this.tmpUserAddService.getTmpUser({ where: { id: id } });
        try {
            const [user1Friends, user2Friends] = await this.tmpUserAddService.removeFriendship(user, user1);
        }
        catch {
            throw new common_1.HttpException("user don't have ths friend", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllUsers() {
        return (await this.tmpUserAddService.getAllUsers());
    }
};
exports.TmpUserController = TmpUserController;
__decorate([
    (0, common_1.Post)('addUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TmpUserController.prototype, "addUser", null);
__decorate([
    (0, common_1.Patch)('makeFriendship'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TmpUserController.prototype, "makeFriendship", null);
__decorate([
    (0, common_1.Patch)('removeFriendship'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TmpUserController.prototype, "removeFriendship", null);
__decorate([
    (0, common_1.Get)('getAllUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TmpUserController.prototype, "getAllUsers", null);
exports.TmpUserController = TmpUserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [tmpUserAdd_service_1.TmpUserService])
], TmpUserController);
//# sourceMappingURL=tmpUser.controller.js.map