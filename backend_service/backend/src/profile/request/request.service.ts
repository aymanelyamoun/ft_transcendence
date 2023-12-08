import { tr } from "@faker-js/faker";
import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { NOTIF_TYPE, User } from "@prisma/client";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestService {
    constructor(private readonly prisma: PrismaService) { }
    

    async handleSendRequest(userId: string, recieverId: string, message: string, typ: NOTIF_TYPE) {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    type: typ,
                    title: 'login',
                    discription: message,
                    userId : recieverId,
                    senderId : userId,
                },
            });
            return notification
        } catch (error)
        {
            return { error: 'Internal server error' };
        }
    }

    async handleAcceptRequest(@Req() req: Request, notificationid: number)
    {
        try {
            console.log('heeeere');
            const user = req['user'] as User;
            const userId = user.id;
            const notification = await this.prisma.notification.findUnique({
                where: { id: notificationid },
            });
            if (!notification)
                throw new NotFoundException();
            console.log(notification.senderId);
            console.log(notification.userId);
            return await this.prisma.$transaction(async (prisma) => {
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
                await prisma.notification.delete({
                    where: { id: notificationid },
                });
            });
        } catch (error)
        {
            console.error(error);
            return { error: 'Internal server error' };
        }
  }

    async handleRefuseRequest(notificationid: number)
    {
        try {
            return await this.prisma.notification.delete({
                where: { id: notificationid },
            });
        } catch (error)
        {
            return { error: 'Internal server error' };
        }
    }
}