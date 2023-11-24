import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";
import { User } from "src/types/types";
import { WsException } from "@nestjs/websockets";
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

        // const hasFriendship = await this.getTmpUser({where:{id: user1.id, friends:{has:user2.id}}})
        const user = await this.getTmpUser({where:{id: user1.id}, include:{friends:true}})
        console.log("user: ", user)
        // const hasFriendship = user.friends.;
        // if (hasFriendship) throw new WsException('Friendship already exists')

        const [user1Friends, user2Friends] = await Promise.all([

            (this.prisma.user.update({
                where: {
                    id: user1.id,
                },
                data: {
                    friends: {
                        create:{friend:{connect:{id:user2.id}}}
                        // connect: { friend:{ id: user2.id} }
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data:{
                    friends:{
                        create:{friend:{connect:{id:user1.id}}}
                    }
                }
            })
        ])
        return [user1Friends, user2Friends];
    }

    async deleteTmpUser(params: Prisma.UserDeleteArgs){
        return (await this.prisma.user.delete(params))
    }

    async deleteAllTmpUsers(){
        return (await this.prisma.user.deleteMany())
    }

    async removeFriendship(user1:User, user2:User){

        // const hasFriendship = await this.getTmpUser({where:{id: user1.id, friends:{has:user2.id}}})

        // thorw exeption if friendship does not exist and set status code to 404
        // console.log("user has friendship:",hasFriendship);
        // if (!hasFriendship) throw new WsException('Friendship does not exist')
        const [user1Friends, user2Friends] = await Promise.all([

            (this.prisma.user.update({
                where: {
                    id: user1.id,
                    },

                data: {
                    friends: {
                        // set: user1.friends.filter((friend) => friend !== user2.id), 
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data:{
                    friends:{
                        // set: user2.friends.filter((friend) => friend !== user1.id),
                    }
                }
            })
        ])
        return [user1Friends, user2Friends];
    }

    async getAllUsers(){
        return (await this.prisma.user.findMany({include:{userDMs:true}}))
    }
}