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
exports.TmpUserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const websockets_1 = require("@nestjs/websockets");
let TmpUserService = class TmpUserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTmpUser(data) {
        return (await this.prisma.user.create({ data }));
    }
    async getTmpUser(params) {
        return (await this.prisma.user.findUnique(params));
    }
    async makeFriendship(user1, user2) {
        const hasFriendship = await this.getTmpUser({ where: { id: user1.id, friends: { has: user2.id } } });
        if (hasFriendship)
            throw new websockets_1.WsException('Friendship already exists');
        const [user1Friends, user2Friends] = await Promise.all([
            (this.prisma.user.update({
                where: {
                    id: user1.id,
                },
                data: {
                    friends: {
                        push: user2.id,
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data: {
                    friends: {
                        push: user1.id,
                    }
                }
            })
        ]);
        return [user1Friends, user2Friends];
    }
    async deleteTmpUser(params) {
        return (await this.prisma.user.delete(params));
    }
    async deleteAllTmpUsers() {
        return (await this.prisma.user.deleteMany());
    }
    async removeFriendship(user1, user2) {
        const hasFriendship = await this.getTmpUser({ where: { id: user1.id, friends: { has: user2.id } } });
        console.log("user has friendship:", hasFriendship);
        if (!hasFriendship)
            throw new websockets_1.WsException('Friendship does not exist');
        const [user1Friends, user2Friends] = await Promise.all([
            (this.prisma.user.update({
                where: {
                    id: user1.id,
                },
                data: {
                    friends: {
                        set: user1.friends.filter((friend) => friend !== user2.id),
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data: {
                    friends: {
                        set: user2.friends.filter((friend) => friend !== user1.id),
                    }
                }
            })
        ]);
        return [user1Friends, user2Friends];
    }
    async getAllUsers() {
        return (await this.prisma.user.findMany({ include: { userDMs: true } }));
    }
};
exports.TmpUserService = TmpUserService;
exports.TmpUserService = TmpUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TmpUserService);
//# sourceMappingURL=tmpUserAdd.service.js.map