export interface Match {
    id: string;
    username: string;
    profilePic: string;
    gameRecords: {
        xp: number;
        scoredGoals: number;
        concededGoals: number;
    }[]
}

export interface MatchProps {
    matches: Match["gameRecords"];
    UserProfileStyling: boolean;
}