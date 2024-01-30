"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { MdGroupAdd } from "react-icons/md";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";
import { BsPersonFillSlash } from "react-icons/bs";
 
import Sidebar from '../sidebar/sidebar';
import FriendProfile from '../../../FriendProfile/page';
import Link from 'next/link';
import ShowGroups from './ShowGroups';
import Image from 'next/image';
// redux part
import { connect, useSelector } from 'react-redux';
import { toggleShowGroups, toggleFetchFriends } from '@/features/booleans/booleanActions';
import { setLoggedInUserId, setSelectedUserId } from '@/features/strings/stringActions';
import { Friend } from '@/app/(auth)/chat/page';
import { SocketUseContext } from "@/utils/socketUseContext";
import { AlertMessage } from '@/app/components/alertMessage';
import { useDispatch } from 'react-redux';

interface FriendInfoProps {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  // setSelectedFriend : React.Dispatch<React.SetStateAction<Friend | false>>;
  onClose: () => void;
  showGroups: boolean;
  toggleShowGroups: () => void;
  setSelectedUserId: (id: string) => void;
}

const InfoName = styled.div`
  font-weight: 800;
  font-size: 2vh;
  font-family: "Inter", sans-serif;
  margin-left: 1rem;
  color: aliceblue;
  position: relative;
  right: 0.5rem;
  bottom: 4vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddGroupButton = styled.button`
  border-radius: 0.5rem;
  position: relative;
  width: 60px;
  height: 50px;
  cursor: pointer;
  align-items: center;
    background: rgba(154, 155, 211, 0.2);
  svg {
      font-size: 2rem;
      color: aliceblue;
      display: inline;
  }

`;

const RemoveFriendButton = styled.button`
  border-radius: 0.5rem;
  position: relative;
  width: 60px;
  height: 50px;
  cursor: pointer;
  align-items: center;
  background: rgba(154, 155, 211, 0.2);
  svg {
      font-size: 1.7rem;
      color: red;
      display: inline;
  }
`;

const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    gap: 1rem;
    position: relative;
    bottom: 11vh;
`;

const BlockButton = styled.button`
  border-radius: 0.5rem;
  position: relative;
  width: 60px;
  height: 50px;
  cursor: pointer;
  align-items: center;
  background: rgba(154, 155, 211, 0.2);
  svg {
      font-size: 1.7rem;
      color: red;
      display: inline;
  }
`;

const GameButton = styled.button`
  border-radius: 0.5rem;
  position: relative;
  width: 60px;
  height: 50px;
  cursor: pointer;
  align-items: center;
  background: rgba(154, 155, 211, 0.2);
  svg {
      font-size: 1.7rem;
      color: aliceblue;
      display: inline;
  }
`;

const FriendInfo = (props : FriendInfoProps) => {
  const onClose = props.onClose;
  const { showGroups, toggleShowGroups, setSelectedUserId } = props;
  // const setSelectedUserId = mapDispatchToProps;
  const infoRef = useRef<HTMLDivElement>(null);
  const loggedInUserId = useSelector((state: RootState) => state.strings.loggedInUserId);
  const socket = React.useContext(SocketUseContext);
  // const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(false);
  const [showAlertDecline, setShowAlertDecline] = useState<boolean>(false);
  const [showAlertBlock, setShowAlertBlock] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleClickOutside = useCallback((event: any) => {
    if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);
  
  useEffect(() => {
    if (!showGroups) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGroups, handleClickOutside]);

  const SendDeclineReq = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/remove/${id}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if(response.ok){
        setShowAlertDecline(true);
        dispatch(toggleFetchFriends());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SendBlockUser = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}request/block/${id}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if(response.ok){
        setShowAlertBlock(true);
        dispatch(toggleFetchFriends());
      }
    } catch (error) {
      console.log(error);
    };
  };

  function inviteToPlay(id : string, loggedInUserId : string) {
    socket.emit("inviteGame", {id: id})
    console.log('invited a user to play');
  }

  const handleShowGroup = () => {
    toggleShowGroups();
    setSelectedUserId(props.id);
  };

return (
  <>
    {!showGroups && (
      <div onClick={handleClickOutside} className="addChannelOverlay flex justify-center items-center ">
        <div ref={infoRef} className={styles['info-container']}>
          <Link href={`/profile/FriendProfile?username=${props.username}`}>
            <div className={styles['info-picture']}>
              <Image src={props.profilePic} alt="" className={styles['info-picture']} />
            </div>
          </Link>
          <InfoName>
            <span>{props.username}</span>
          </InfoName>
          <ButtonContainer>
            <AddGroupButton onClick={handleShowGroup}>
              <MdGroupAdd />
            </AddGroupButton>
            <GameButton onClick={(e: any) => {inviteToPlay(props.id, loggedInUserId)}}>
              <IoGameController />
            </GameButton>
            <RemoveFriendButton onClick={() => SendDeclineReq(props.id)}>
              <IoPersonRemoveSharp />
            </RemoveFriendButton>
            <BlockButton onClick={() => SendBlockUser(props.id)}>
              <BsPersonFillSlash />
            </BlockButton>
          </ButtonContainer>
        </div>
      </div>
    )}
    {
      showAlertDecline && (<AlertMessage onClick={() => setShowAlertDecline(false)} message={"The user has been removed"}  type="error"/>)
    }
    {
      showAlertBlock && (<AlertMessage onClick={() => setShowAlertBlock(false)} message={"The user has been blocked"} type="error"/>)
    }
  </>
);

};

const mapStateToProps = (state : RootState) => {
  return {
    showGroups: state.booleans.showGroups,
    setSelectedUserId: state.strings.selectedUserId,
  };
};

const mapDispatchToProps = {
  toggleShowGroups,
  setSelectedUserId,
  toggleFetchFriends,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendInfo);