"use client"

import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import FriendComponent from './FriendComponent'
import GroupComponent from './GroupComponent'
import { AddSearchInterface, SearchU } from '../interfaces'
import { ResultItemProps } from '../interfaces'
// import { SearchU } from '../SearchFriends/SearchFriends'

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
  console.log("members", props);
  return (
    <ItemContainer>
      {props.group ? (
        <GroupComponent key={props.id} id={props.id} channelName={props.channelName} channelPic={props.channelPic} channelType={props.channelType} members={props.members} setChannelFriendSearchU={props.setChannelFriendSearch} ShowGroups={false} bannedUsers={[]} setChannelFriendSearch={function (value: React.SetStateAction<AddSearchInterface[]>): void {
          throw new Error('Function not implemented.')
        } }/>
      ) : (
        <FriendComponent key={props.id}id={props.id} username={props.username} profilePic={props.profilePic} isBlocked={props.isBlocked} setSearchUsers={props.setSearchUsers}/>
      )}
    </ItemContainer>
  );
};

export default ResultItem;