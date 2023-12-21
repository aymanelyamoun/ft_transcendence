import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import FriendComponent from './FriendComponent'
import GroupComponent from './GroupComponent'


// interface SearchU {
//   id: number;
//   name: string;
//   profilePic: StaticImageData;
//   group: boolean;
//   groupMembers?: StaticImageData[];
// }
interface SearchU {
  id: number;
  username: string;
  profilePic: string;
  isBlocked: boolean;
  group: boolean;
  groupMembers?: string[];
}

interface ResultItemProps {
    id: number;
    username: string;
    profilePic: string;
    isBlocked: boolean;
    group: boolean;
    groupMembers?: string[];
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
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
        <GroupComponent id={props.id} username={props.username} profilePic={props.profilePic} groupMembers={props.groupMembers}/>
      ) : (
        <FriendComponent id={props.id} username={props.username} profilePic={props.profilePic} isBlocked={props.isBlocked} setSearchUsers={props.setSearchUsers}/>
      )}
    </ItemContainer>
  );
};

export default ResultItem;