import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";
import { User } from "src/types/types";
// import { PrismaClient } from '@prisma/client';

@Injectable()
export class TmpUserService{
    constructor(private readonly prisma: PrismaService){}

    // async createTmpUser(data: Prisma.tmpUserCreateInput){
    //     return this.prisma.tmpUser.create({data});
    // }

    async createTmpUser(data :Prisma.UserCreateInput){
        return (await this.prisma.user.create({data}))
    }
    async getTmpUser(params: Prisma.UserFindUniqueArgs){
        return (await this.prisma.user.findUnique(params))
    }

    async makeFriendship(user1:User, user2:User){

        const hasFriendship = await this.getTmpUser({where:{id: user1.id, friends:{has:user2.id}}})
        if (!hasFriendship){
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
                    data:{
                        friends:{
                            push: user1.id,
                        }
                    }
                })
            ])
            return [user1Friends, user2Friends];
    }
    }

    async getAllUsers(){
        return (await this.prisma.user.findMany())
    }
}