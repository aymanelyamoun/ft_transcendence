"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const chat_module_1 = require("./chat/chat.module");
const prisma_module_1 = require("./prisma/prisma.module");
const tmpUserAdd_service_1 = require("./prisma/tmpUserAdd.service");
const prisma_service_1 = require("./prisma/prisma.service");
const tmpUser_controller_1 = require("./prisma/tmpUser.controller");
const prisma_chat_service_1 = require("./prisma/chat/prisma.chat.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot(), chat_module_1.ChatModule, prisma_module_1.PrismaModule],
        controllers: [tmpUser_controller_1.TmpUserController],
        providers: [app_service_1.AppService, tmpUserAdd_service_1.TmpUserService, prisma_service_1.PrismaService, prisma_chat_service_1.PrismaChatService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map