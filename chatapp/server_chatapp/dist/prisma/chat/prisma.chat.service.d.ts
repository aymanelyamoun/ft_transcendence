import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";
export declare class PrismaChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createNewDM(userId: string, data: Prisma.MessagesCreateInput): Promise<void>;
}
