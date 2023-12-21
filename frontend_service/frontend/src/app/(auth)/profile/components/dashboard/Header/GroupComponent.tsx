import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import { MdGroupAdd } from "react-icons/md";

interface GroupComponentProps {
    id: number;
    username: string;
    profilePic: string;
    groupMembers?: string[];
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
  return (
    <>
    <FriendImage>
    <img src={props.profilePic} alt="Profile" className="rounded-full" />
    </FriendImage>
    <FriendName>
            <span>{props.username}</span>
    </FriendName>
    <GroupPictures>
        <GroupPictureItem>
            {props.groupMembers?.map((member) => (
                <img src={member} alt="Profile" className="rounded-full" />
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