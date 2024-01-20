import { SetStateAction } from "react";

export interface SearchU {
    creator: {
        id: string;
    };
    members: {
        user: {
            profilePic: string;
            id: string;
        };
    }[];
  
    id: string;
    username: string;
    profilePic: string;
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
        id: string;
      };
    }[];
    
    id: string;
    username: string;
    profilePic: string;
    channelName: string;
    channelPic: string;
    // creatorId: string;
    channelType: string;
    hash?: string;
    isBlocked: boolean;
    group: boolean;
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
    setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
    }

    export interface GroupComponentProps<>
    {
      bannedUsers: {
        id: string;
    }[];
    id: string;
    channelName: string;
    channelPic: string;
    channelType: string;
    members: {
      user: {
        profilePic: string;
        id: string;
      };
            }[];
        setChannelFriendSearchU: React.Dispatch<React.SetStateAction<SearchU[]>>;
        setChannelFriendSearch: React.Dispatch<React.SetStateAction<AddSearchInterface[]>>;
        ShowGroups: boolean;
      }

export interface StatisticsPieInterface
{
  wins: number;
  losses: number;
  total: number;
}

export interface StatisticsChartInterface
{
  daysOfWeek: {
    day: string;
    gamesPlayed: number;
  }[];
}
export interface AddSearchInterface
{
    bannedUsers: {
        id: string;
    }[];
    id: string;
    channelName: string;
    channelPic: string;
    creatorId: string;
    channelType: string;
    hash: string;
    members: {
      user: {
        profilePic: string;
        id: string;
      };
    }[];
}

export interface ProtectedPassProps
{
  setInputPassword: React.Dispatch<SetStateAction<string>>;
  setPasswordSent: React.Dispatch<SetStateAction<boolean>>;
  setOpenPassComp: React.Dispatch<SetStateAction<boolean>>;
  inputPassword: string;
}