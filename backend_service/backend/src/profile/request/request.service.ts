 import { tr } from "@faker-js/faker";
import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { NOTIF_TYPE, User } from "@prisma/client";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
import { Request, Response, NextFunction } from 'express';
import { UserService } from "../user/user.service";
import { CONVERSATION_TYPE } from "@prisma/client";

@Injectable()
export class RequestService {
    constructor(private readonly prisma: PrismaService,
            private readonly userService: UserService) { }
    

    async handleSendRequest(userId: string, recieverId: string, message: string, typ: NOTIF_TYPE) {
        try 
        {
            const existingNotification = await this.prisma.notification.findFirst({
                where: {
                    userId: recieverId,
                    senderId: userId,
                    type: typ,
                },
            });
            const ChekcNotification = await this.prisma.notification.findFirst({
                where: {
                    userId: userId,
                    senderId:recieverId ,
                    type: typ,
                },
            });
            if (!existingNotification && !ChekcNotification)
            {
                    const  sender = await this.userService.findById(userId);            
                    const notif =  await this.prisma.notification.create({
                    data: {
                        type: typ,
                        title: sender.username,
                        discription: sender.username + ' sent you friend request',
                        userId : recieverId,
                        senderId : userId,
                    },
                });
                return { message: 'request sended successfully' };
            }else{
                return { message: 'the request already sended' };
            }
        } catch (error)
        {
            throw new NotFoundException(error);
        }
    }

    async handleAcceptRequest(@Req() req: Request, notificationid: number)
    {
        try {
            const user = req['user'] as User;
            const userId = user.id;
            const notification = await this.prisma.notification.findUnique({
                where: { id : +notificationid },
            });
            if (!notification)
                throw new NotFoundException();
            const isBlocked = await this.isBlocked(notification.userId, notification.senderId);
            if (isBlocked)
                throw new Error('Friend is blocked by the user');
            const result = await this.prisma.$transaction(async (prisma) => 
            {
                await prisma.user.update({
                    where: { id: notification.userId},
                    data: { friends: { connect: { id: notification.senderId } } },
                });

                await prisma.user.update({
                where: { id: notification.senderId },
                data: {
                    friends: { connect: { id: notification.userId } },
                },
                });

                await prisma.notification.deleteMany({
                    where: {
                        OR: [
                            { senderId: notification.userId, userId: notification.senderId, type: NOTIF_TYPE.friendReq },
                            { senderId: notification.senderId, userId: notification.userId, type: NOTIF_TYPE.friendReq },
                        ],
                    },
                })


            });

            // if (result)
            //     return;
            const conversation = await this.prisma.conversation.findFirst({
                where:{
                    users:{
                        every:{
                            id:{
                                in:[notification.userId, notification.senderId]
                            }
                        }
                    }
                }
            })
            
            if (conversation) return;
            const conv = await this.prisma.conversation.create({
                data:{
                    type:CONVERSATION_TYPE.DIRECT,
                    members:{
                        create:[{userId:notification.userId}, {userId:notification.senderId}]
                      },
                    users:{
                        connect:[
                            {id:notification.userId},
                            {id:notification.senderId}
                        ]
                    }
                }
            })
        } catch (error)
        {
            throw new NotFoundException(error);
        }
  }

    async handleRefuseRequest(notificationid: number)
    {
        try {

            const notification = await this.prisma.notification.findUnique({
                where: { id: +notificationid },
            });
            await this.prisma.notification.deleteMany({
                where: {
                    OR: [
                        { senderId: notification.userId, userId: notification.senderId, type: NOTIF_TYPE.friendReq },
                        { senderId: notification.senderId, userId: notification.userId, type: NOTIF_TYPE.friendReq },
                    ],
                },
            })
        } catch (error)
        {
            throw new NotFoundException(error);
        }
    }

    async isBlocked(userId: string, blockedUserId: string){
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { blockedUsers: true }
        });
        return !!user?.blockedUsers.find((blockedUser) => blockedUser.id === blockedUserId);
    }
    
    async BlockUser(userId: string, userIdB: string)
    {
        try
        {
            const block = this.userService.removeFriend(userId, userIdB);
            if (!block)
                throw new NotFoundException();
            const isCurrBlocked = await this.isBlocked(userIdB, userId);
            if (isCurrBlocked)
                return;
            await this.prisma.$transaction(async (prisma) => {
                await prisma.user.update({
                    where: {id : userId},
                    data:{blockedUsers:{connect : {id : userIdB}}}
                });
                await prisma.user.update({
                    where : {id : userIdB},
                    data:{blockedByUsers:{connect : {id : userId}}}
                });
                // await prisma.conversation.delete({where:{}})
            })

            // const conversation = await this.prisma.conversation.findFirst({
            //     where:{
            //         users:{
            //             every:{
            //                 id:{
            //                     in:[userId, userIdB]
            //                 }
            //             }
            //         }
            //     }
            // })
            
            // if (!conversation) return;

            // await this.prisma.conversation.delete({where:{id:conversation.id}});

        }
        catch(error)
        {
            throw new NotFoundException(error);
        }
    }

    async DeBlockUser(userId: string, userIdB: string)
    {
        try
        {
            return await this.prisma.$transaction(async (prisma) => {
                await prisma.user.update({
                    where: {id : userId},
                    data:{blockedUsers:{disconnect : {id : userIdB}}}
                });
                await prisma.user.update({
                    where : {id : userIdB},
                    data:{blockedByUsers:{disconnect : {id : userId}}}
                })
            })
        }
        catch(error)
        {
            throw new NotFoundException(error);
        }
    }

    async BlockList(userId: string)
    {
        try
        {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { blockedUsers: true },
            });

            if (!user)
                throw new Error('User not found');
            return user.blockedUsers;
        }
        catch (error)
        {
            throw new Error( 'Internal server error')
        }
    }
}