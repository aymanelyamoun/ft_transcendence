"use client"

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import { MdGroupAdd } from "react-icons/md";
// import { SearchU } from '../SearchFriends/SearchFriends'
import { SearchU } from '../interfaces';
import { GroupComponentProps } from '../interfaces';
import { Backend_URL } from '@/lib/Constants';
import { BsFillPersonCheckFill, BsPersonFillDash } from "react-icons/bs";
import { AddSearchInterface } from '../interfaces';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedPassword from './ProtectedPassword';


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

const BannedUser = styled.button`
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

  const ShowGroups = props.ShowGroups;
  const [inputPassword, setInputPassword] = useState<string>("");
  const ChannelType = props.channelType;
  const setChannelFriendSearch = props.setChannelFriendSearch;
  const [UserUnbanned, setUserUnbanned] = useState<boolean>(false);
  const [UserAdded, setUserAdded] = useState<boolean>(false);
  const dispatch = useDispatch();
    // Use useSelector to directly access selectedUserId from the Redux store
    const selectedUserId = useSelector((state: RootState) => state.strings.selectedUserId);

  function isUserBanned(user: string, bannedUsers: {id: string}[]) : boolean
  {
    return (bannedUsers.some(BannedUser => BannedUser.id === user));
  }

  const isBanned = isUserBanned(props.id , props.bannedUsers);

  const SendRequestUser = async (props: GroupComponentProps) => {
    try {
      const res = await fetch(Backend_URL+"channels/addUserToChannel", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: selectedUserId,
          userId2: props.id,
        }),
      });
      if (res.ok)
      {
        alert("the request has been sent");
        setUserAdded(true);
      } else {
        alert("the request has not been sent");
       }
    } catch (error)
    {
      console.log(error);
    }
  };

  const SendRequestMe = async (props: GroupComponentProps) => {
    try {
      const res = await fetch (Backend_URL+"channels/joinChannel", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: selectedUserId,
          // password?: ---; 
        })
      })
    }
    catch (error)
    {
      console.log("error in sending the request to join me: ", error);
    }
  };

  const UnbanUser = async (props: GroupComponentProps) => {
    try {
      const res = await fetch(Backend_URL+"channels/unbanUser", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: selectedUserId,
          userId2: props.id,
        }),
      });
      if (res.ok)
      {
        fetchIcon();
        setUserUnbanned(true);
        alert("the user has been unbanned");
      }else {
        alert("the user has not been unbanned");
       }
    } catch (error) {
      console.log("unban user from group error: ", error);
    }
  };

  const fetchIcon = async () => {
    try {
      const res = await fetch( Backend_URL+"channels/toAddSearch", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setChannelFriendSearch(data);
      } else
      {
        alert("Error fetching data: ");
        console.error("Error fetching data: ", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchIcon();
  },[setChannelFriendSearch]);

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
            {props.members?.map((member) => (
              console.log("member profile pic: ",member.user.profilePic),
                <img src={member.user.profilePic} alt="Profile" className="rounded-full" />
            ))}
        </GroupPictureItem>
      </GroupPictures>
        {ShowGroups ? (
          isBanned && !UserUnbanned ? (
            <BannedUser onClick={() => UnbanUser(props)}>
              <BsPersonFillDash />
            </BannedUser>
          ) : (
            <AddGroupButton onClick={() => SendRequestUser(props)}>
              {UserAdded ? <BsFillPersonCheckFill /> : <MdGroupAdd />}
            </AddGroupButton>
          )
        ) : (
          <>
            {ChannelType === "protected" ? (
              <ProtectedPassword />
            ) : (
              <AddGroupButton onClick={() => SendRequestMe(props)}>
                <MdGroupAdd />
              </AddGroupButton>
            )}
          </>
        )}
    </>
  );
};

export default connect((state: RootState) => ({
  selectedUserId: state.strings.selectedUserId,
}))(GroupComponent);