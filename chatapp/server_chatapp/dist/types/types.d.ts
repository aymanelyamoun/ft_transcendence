export type User = {
    id: string;
    creatorOf?: string[];
    admineOf?: string[];
    friends?: string[];
    blockedUsers?: string[];
    profilePic: string;
    username: string;
    title: string;
};
