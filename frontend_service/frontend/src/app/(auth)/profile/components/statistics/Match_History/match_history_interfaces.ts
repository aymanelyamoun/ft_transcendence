export interface Match {
    id: string;
    username: string;
    profilePic: string;
    gameRecords: {
        xp: number;
        scoredGoals: number;
        concededGoals: number;
        user : {    
            profilePic: string;
        };
        oponent : {
            profilePic: string;
        };
    }[]
}

export interface MatchProps {
    matches: Match["gameRecords"];
    UserProfileStyling: boolean;
}