"use client"

import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import { MdGroupAdd } from "react-icons/md";
import { SearchU } from '../SearchFriends/SearchFriends'


// interface SearchU {
//   id: string;
//   username?: string;
//   channelName?:string;
//   profilePic?: string;
//   channelPic?: string;
//   isBlocked: boolean;
//   group: boolean;
//   Members?: string[];
// }

interface GroupComponentProps {
  id: string;
  channelName?:string;
  profilePic?: string;
  channelPic?: string;
  Members?: {
        user: {
                profilePic: string;
    };
}[];
  setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
}

const FriendImage = styled.div`
    width: 3.4rem;
    height: 3rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    border-radius: 50%;
`;

const FriendName = styled.div`
    font-family: "Inter", sans-serif;
    font-weight: 800;
    font-size: 15px;
    font-weight: bold;
    color: aliceblue;
    align-self: flex-start;
    margin-left: 16px;
    margin-top: 4px;
`;

const AddGroupButton = styled.button`
  onClick={() => {

  }}
    position: relative;
    // left: 13vw;
    margin-left: auto;
    margin-right: 1vw;
    top: 0vh;
    svg {
        font-size: 1.5rem;
        color: aliceblue;
    }
`;

const GroupPictures = styled.div`
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    position: relative;
    top: 1vh;
    left: -4vh;
`;

const GroupPictureItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 2rem;
  height: 1.3rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 50%;
    position: relative;
    // margin-left: 0.5vw;
`;

const GroupComponent: React.FC<GroupComponentProps> = (props) => {
  console.log("members: ",props.Members)
  return (
    <>
    <FriendImage>
    <img src={props.channelPic} alt="Profile" className="rounded-full" />
    </FriendImage>
    <FriendName>
            <span>{props.channelName}</span>
    </FriendName>
    <GroupPictures>
        <GroupPictureItem>
            {props.Members?.map((member) => (
              console.log("member profile pic: ",member.user.profilePic),
                <img src={member.user.profilePic} alt="Profile" className="rounded-full" />
            ))}
        </GroupPictureItem>
      </GroupPictures>
    <AddGroupButton>
      <MdGroupAdd />
    </AddGroupButton>
    </>
  )
}

export default GroupComponent