import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";
import { User } from "src/types/types";
export declare class TmpUserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTmpUser(data: Prisma.UserCreateInput): Promise<{
        id: string;
        creatorOf: string[];
        admineOf: string[];
        friends: string[];
        blockedUsers: string[];
        profilePic: string;
        username: string;
        title: string;
    }>;
    getTmpUser(params: Prisma.UserFindUniqueArgs): Promise<{
        id: string;
        creatorOf: string[];
        admineOf: string[];
        friends: string[];
        blockedUsers: string[];
        profilePic: string;
        username: string;
        title: string;
    }>;
    makeFriendship(user1: User, user2: User): Promise<{
        id: string;
        creatorOf: string[];
        admineOf: string[];
        friends: string[];
        blockedUsers: string[];
        profilePic: string;
        username: string;
        title: string;
    }[]>;
    getAllUsers(): Promise<{
        id: string;
        creatorOf: string[];
        admineOf: string[];
        friends: string[];
        blockedUsers: string[];
        profilePic: string;
        username: string;
        title: string;
    }[]>;
}
