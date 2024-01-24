"use client"

import React, { useEffect, useRef } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { MdGroupAdd } from "react-icons/md";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";
import { BsPersonFillSlash } from "react-icons/bs";
import { Backend_URL } from '@/lib/Constants';
import Sidebar from '../sidebar/sidebar';
import FriendProfile from '../../../FriendProfile/page';
import Link from 'next/link';
import ShowGroups from './ShowGroups';

// redux part
import { connect, useSelector } from 'react-redux';
import { toggleShowGroups } from '@/features/booleans/booleanActions';
import { setLoggedInUserId, setSelectedUserId } from '@/features/strings/stringActions';
import { Friend } from '@/app/(auth)/chat/page';
import { SocketUseContext } from "../../../dashboard/page";

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

const FriendInfo : React.FC<FriendInfoProps> = (props) => { // Warning: forwardRef render functions accept exactly two parameters: props and ref. Did you forget to use the ref parameter?
  // const setSelectedFriend = props.setSelectedFriend;
  const onClose = props.onClose;
  const { showGroups, toggleShowGroups, setSelectedUserId } = props;
  // const setSelectedUserId = mapDispatchToProps;
  const infoRef = useRef<HTMLDivElement>(null);
  const loggedInUserId = useSelector((state: RootState) => state.strings.loggedInUserId);
  const socket = React.useContext(SocketUseContext);
  // const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(false);

  // useEffect(() => {
  //   // console.log('showGroups value:', showGroups);
  //   console.log("FriendInfo Mounted:", props.id, props.username, props.profilePic);

  //   return () => {
  //     console.log("FriendInfo Unmounted");
  //   };
  // }, [props.id, props.username, props.profilePic, showGroups]);

  const handleClickOutside = (event: any) => {
    console.log('Clicked outside');
    if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
      // Click outside the FriendInfo component, hide it
      onClose();
    }
  };

  useEffect(() => {

    if (!showGroups) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, showGroups]);

  const SendDeclineReq = async (id: string) => {
    try {
      const response = await fetch(`${Backend_URL}user/remove/${id}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if(response.ok){
        alert("the user has been removed");
      }else {
        alert("the user has not been removed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SendBlockUser = async (id: string) => {
    try {
      const response = await fetch(`${Backend_URL}request/block/${id}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if(response.ok){
        alert("the user has been blocked");
      }else {
        alert("the user has not been blocked");
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
              <img src={props.profilePic} alt="" className={styles['info-picture']} />
            </div>
          </Link>
          <InfoName>
            <span>{props.username}</span>
          </InfoName>
          <ButtonContainer>
            <AddGroupButton onClick={handleShowGroup}>
              <MdGroupAdd />
            </AddGroupButton>
            <GameButton onClick={(e) => {inviteToPlay(props.id, loggedInUserId)}}>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendInfo);