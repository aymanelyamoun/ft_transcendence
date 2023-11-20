import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaChatService{
    constructor(private readonly prisma: PrismaService) {}

        async createNewDM(userId:string, data: Prisma.MessagesCreateInput){
          const DMexists = await this.prisma.messages.findMany({
            where: {
              usersMessages: {
                some: {
                  userId: data.receiver
                }
              }
            }
          });

          console.log("user exists: ", data);
          console.log("dm:", DMexists);
          if (!DMexists.length) {
            const new_DM = await this.prisma.messages.create({ data });
            console.log("new_DM", new_DM);
          }
            // if (!new_DM)
            //   return;
            //     await this.prisma.user.update({
            //       where: {
            //         id: userId,
            //       },
            //       data: {
            //         userDMs: {
            //             connect: new_DM,
            //         },
            //       },
            //     },
            //   );
          // }
        }
}