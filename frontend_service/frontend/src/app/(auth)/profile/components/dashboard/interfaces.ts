export interface SearchU {
    creator: {
        id: string;
    };
    members: {
        user: {
            profilePic: string;
        };
    }[];
  
    id: string;
    username?: string;
    profilePic?: string;
    channelName: string;
    channelPic: string;
    creatorId: string;
    channelType: string;
    hash: string;
    isBlocked: boolean;
    group: boolean;
  
  }
  export interface ResultItemProps {
    members: {
      user: {
        profilePic: string;
      };
    }[];
    
    id: string;
    username?: string;
    profilePic?: string;
    channelName?: string;
    channelPic?: string;
    // creatorId: string;
    channelType?: string;
    hash?: string;
    isBlocked: boolean;
    group: boolean;
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
    setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
    }

    export interface GroupComponentProps {
        id: string;
        channelName?:string;
        profilePic?: string;
        channelPic?: string;
        members?: {
              user: {
                    profilePic: string;
          };
      }[];
        setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
      }