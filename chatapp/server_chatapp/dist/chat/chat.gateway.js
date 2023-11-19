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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const dto_1 = require("./DTOs/dto");
const prisma_chat_service_1 = require("../prisma/chat/prisma.chat.service");
const tmpUserAdd_service_1 = require("../prisma/tmpUserAdd.service");
let ChatGateway = class ChatGateway {
    constructor(prismaChat, tmpUserAddService) {
        this.prismaChat = prismaChat;
        this.tmpUserAddService = tmpUserAddService;
        this.connectedSockets = new Set();
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('connected', socket.id);
        });
    }
    subscribeUserData(client, data) {
        console.log(data);
        this.connectedSockets.add({ socket: client, usernameId: data.usernameId, username: data.username, });
    }
    async sendMessageTo(client, msg) {
        const requestedSocket = this.getRequestedSocket(msg.messageTo);
        const user = await this.tmpUserAddService.getTmpUser({ where: { id: msg.messageFrom } });
        this.prismaChat.createNewDM(msg.messageFrom, {
            toUserId: msg.messageTo,
            userMessages: {
                connect: { id: user.id }
            }
        });
        console.log("sending message to", msg.messageTo);
        requestedSocket.emit('onMessage', msg.message);
    }
    getRequestedSocket(username) {
        for (const element of this.connectedSockets) {
            if (element.username === username) {
                return element.socket;
            }
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('userData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, dto_1.userDataDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "subscribeUserData", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('messageTo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, dto_1.messageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessageTo", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [prisma_chat_service_1.PrismaChatService, tmpUserAdd_service_1.TmpUserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map