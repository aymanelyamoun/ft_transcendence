"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StaticImageData } from "next/image";
import { MdGroupAdd } from "react-icons/md";
import { SearchU } from '../interfaces';
import { GroupComponentProps } from '../interfaces';
 
import { BsFillPersonCheckFill, BsPersonFillDash } from "react-icons/bs";
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedPassword from './ProtectedPassword';
import Image from 'next/image';
import { toggleSearchFetch } from '@/features/booleans/booleanActions';
import { AlertMessage } from '@/app/components/alertMessage';

import { BsFillPersonCheckFill, BsPersonFillDash } from "react-icons/bs";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import ProtectedPassword from "./ProtectedPassword";
import Image from "next/image";
import { toggleSearchFetch } from "@/features/booleans/booleanActions";

const BannedUser = styled.button`
  position: relative;
  // left: 13vw;
  margin-left: auto;
  margin-right: 1vw;
  top: 0vh;
  svg {
    font-size: 1.5rem;
    color: red;
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
    position: relative;
    margin-left: auto;
    margin-right: 1vw;
    top: 0vh;
    svg {
        font-size: 1.5rem;
        color: aliceblue;
    }
  }
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
`;

const GroupComponent: React.FC<GroupComponentProps> = (props) => {
  const ShowGroups = props.ShowGroups;
  const getBannedUsers = props.banedUsers;
  const [inputPassword, setInputPassword] = useState<string>("");
  const ChannelType = props.channelType;
  const [UserUnbanned, setUserUnbanned] = useState<boolean>(false);
  const [UserAdded, setUserAdded] = useState<boolean>(false);
  const [passwordSent, setPasswordSent] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [openPassComp, setOpenPassComp] = useState<boolean>(false);
  const [meAdded, setMeAdded] = useState<boolean>(false);
  const selectedUserId = useSelector((state: RootState) => state.strings.selectedUserId);
  const loggedInUserId = useSelector((state: RootState) => state.strings.loggedInUserId);
  const [showAlertRequestUser, setShowAlertRequestUser] = useState<boolean>(false);
  const [showAlertRequestMe, setShowAlertRequestMe] = useState<boolean>(false);
  const [showAlertUnbanUser, setShowAlertUnbanUser] = useState<boolean>(false);
  const [showAlertRequestProtected, setShowAlertRequestProtected] = useState<boolean>(false);
  const [showAlertPassIncorr, setShowAlertPassIncorr] = useState<boolean>(false);
  const [passRes, setPassRes] = useState<string>('');

  function isUserBanned(user: string, bannedUsers: { id: string }[]): boolean {
    return bannedUsers.some((BannedUser) => BannedUser.id === user);
  }

  const isBanned = isUserBanned(selectedUserId, props.banedUsers);

  function isUserMember(
    members: { user: { profilePic: string; id: string } }[],
    userId: string
  ) {
    return members.some((member) => member.user.id === userId);
  }

  const isMember = isUserMember(props.members, loggedInUserId);

  const SendRequestUser = async (props: GroupComponentProps) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/addUserToChannel", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: props.id,
          userId2: selectedUserId,
        }),
      });
      if (res.ok)
      {
        setUserAdded(true);
        setShowAlertRequestUser(true);
      }
    } catch (error)
    {
      console.log(error);
    }
  };

  const SendRequestMe = async (props: GroupComponentProps) => {
    try {
      const res = await fetch (process.env.NEXT_PUBLIC_BACKEND_URL+"channels/joinChannel", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: props.id,
          password: "",
        }),
      });
      if (res.ok)
      {
        setShowAlertRequestMe(true);
        setMeAdded(true);
        dispatch(toggleSearchFetch());
      }
    } catch (error) {
      console.log("error in sending the request to join CATCH me: ", error);
    }
  };

  const UnbanUser = async (props: GroupComponentProps) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/unbanUser", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: props.id,
          userId2: selectedUserId,
        }),
      });
      if (res.ok)
      {
        setShowAlertUnbanUser(true);
      }
    } catch (error) {
      console.log("unban user from group error: ", error);
    } finally {
      setUserUnbanned(true);
    }
  };

  const SendRequestUserProtected = async (props: GroupComponentProps) => {
    try {
      const res = await fetch (process.env.NEXT_PUBLIC_BACKEND_URL+"channels/joinChannel", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          channelId: props.id,
          password: inputPassword,
        }),
      });
      if (res.ok)
      {
        setShowAlertRequestProtected(true);
        setMeAdded(true);
        dispatch(toggleSearchFetch());
      }
      else if (res.status === 403) {
        const err = await res.json();
        setShowAlertPassIncorr(true);
        setPassRes(err.message);
        setPasswordSent(false);
      } else {
        const err = await res.json();
        setShowAlertPassIncorr(true);
        setPassRes(err.message);
        setPasswordSent(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPasswordSent(false);
    }
  };

  const handleOpenPassComp = (event: any) => {
    if (!passwordSent) setOpenPassComp(true);
    else {
      SendRequestUserProtected(props);
    }
  };

  return (
    <>
      <>
        <FriendImage>
          <Image
            src={props.channelPic}
            alt="Profile"
            className="rounded-full"
          />
        </FriendImage>
        <FriendName>
          <span>{props.channelName}</span>
        </FriendName>
        <GroupPictures>
          <GroupPictureItem>
            {props.members?.map((member) => (
              <Image
                key={member.user.id}
                src={member.user.profilePic}
                alt="Profile"
                className="rounded-full"
              />
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
              <AddGroupButton onClick={handleOpenPassComp}>
                <MdGroupAdd />
              </AddGroupButton>
            ) : (
              <AddGroupButton onClick={() => SendRequestMe(props)}>
                {meAdded ? <BsFillPersonCheckFill /> : <MdGroupAdd />}
              </AddGroupButton>
            )
          ) : (
            <>
              {ChannelType === "protected" ? (
                <AddGroupButton onClick={handleOpenPassComp}>
                  <MdGroupAdd />
                </AddGroupButton>
              ) : (
                <AddGroupButton onClick={() => SendRequestMe(props)}>
                  {meAdded ? <BsFillPersonCheckFill /> : <MdGroupAdd />}
                </AddGroupButton>
              )}
              
              {openPassComp && (
                <ProtectedPassword inputPassword={inputPassword} setInputPassword={setInputPassword} setPasswordSent={setPasswordSent} setOpenPassComp={setOpenPassComp} />
              )}
            </>
          )}
          {
            showAlertRequestUser && (<AlertMessage onClick={() => setShowAlertRequestUser(false)} message={"The user has been added to the channel successfully!"} type='notify'/>)
          }
          {
            showAlertRequestMe && (<AlertMessage onClick={() => setShowAlertRequestMe(false)} message={"You are successfully added to this channel!"} type='notify'/>)
          }
          {
            showAlertUnbanUser && (<AlertMessage onClick={() => setShowAlertUnbanUser(false)} message={"The user has been unbanned successfully!"} type='notify'/>)
          }
          {
            showAlertPassIncorr && (<AlertMessage onClick={() => setShowAlertPassIncorr(false)} message={`Forbidden: ${passRes}`} type='error'/>)
          }
          {
            showAlertRequestProtected && (<AlertMessage onClick={() => setShowAlertRequestProtected(false)} message={"You are successfully added to this channel!"} type='notify'/>)
          }
        </>
    </>
  );
};

export default connect((state: RootState) => ({
  selectedUserId: state.strings.selectedUserId,
  loggedInUserId: state.strings.loggedInUserId,
}))(GroupComponent);
