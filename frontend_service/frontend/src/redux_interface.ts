interface RootState
{
    booleans:
    {
        showGroups: boolean;
        activeFetch: boolean;
        fetchFriends: boolean;
        // other properties
    };
    // other features
    strings:
    {
        selectedUserId: any;
        loggedInUserId: any;
        setAddUserProfile: any;
        type: string;
        payload: string;
    }
}