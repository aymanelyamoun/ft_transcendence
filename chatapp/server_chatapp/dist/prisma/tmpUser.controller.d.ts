import { TmpUserService } from "./tmpUserAdd.service";
export declare class TmpUserController {
    private readonly tmpUserAddService;
    constructor(tmpUserAddService: TmpUserService);
    addUser(data: any): Promise<void>;
    makeFriendship({ id, username }: {
        id: string;
        username: string;
    }): Promise<void>;
    removeFriendship({ id, username }: {
        id: string;
        username: string;
    }): Promise<void>;
    getAllUsers(): Promise<({
        userDMs: {
            userId: string;
            messagesId: string;
        }[];
    } & {
        id: string;
        creatorOf: string[];
        admineOf: string[];
        friends: string[];
        blockedUsers: string[];
        profilePic: string;
        username: string;
        title: string;
    })[]>;
}
