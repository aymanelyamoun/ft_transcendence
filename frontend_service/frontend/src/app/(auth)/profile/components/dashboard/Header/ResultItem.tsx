"use client"

import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import FriendComponent from './FriendComponent'
import GroupComponent from './GroupComponent'
import { SearchU } from '../SearchFriends/SearchFriends'

// interface SearchU {
//   id: number;
//   name: string;
//   profilePic: StaticImageData;
//   group: boolean;
//   groupMembers?: StaticImageData[];
// }
// interface SearchU {
//   id: string;
//   channelName?:string;
//   username?: string;
//   profilePic?: string;
//   channelPic?: string;
//   isBlocked: boolean;
//   group: boolean;
//   Members?: string[];
// }

interface ResultItemProps {
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
  setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
  setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
  }

  const ItemContainer = styled.div`
  background: rgba(154, 155, 211, 0.2);
  display: flex;
  align-items: center;
  width: 85%;
  // width: 100%;
  heigh: 120px;
  padding: 6px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(154, 155, 211, 0.2);
  margin: 15px 10px;
  border-radius: 15px;
    `;

const ResultItem: React.FC<ResultItemProps> = (props) => {
  return (
    <ItemContainer>
      {props.group ? (
        <GroupComponent id={props.id} channelName={props.channelName} channelPic={props.channelPic} Members={props.members} setChannelFriendSearch={props.setChannelFriendSearch}/>
      ) : (
        <FriendComponent id={props.id} username={props.username} profilePic={props.profilePic} isBlocked={props.isBlocked} setSearchUsers={props.setSearchUsers}/>
      )}
    </ItemContainer>
  );
};

export default ResultItem;