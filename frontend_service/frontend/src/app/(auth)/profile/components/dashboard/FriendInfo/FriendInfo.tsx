import React, { useEffect } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { MdGroupAdd } from "react-icons/md";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";
import { BsPersonFillSlash } from "react-icons/bs";
import { Backend_URL } from '@/lib/Constants';

interface FriendInfoProps {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
}

const InfoName = styled.div`
  font-weight: 800;
  font-size: 2vh;
  font-family: "Inter", sans-serif;
  margin-left: 1rem;
  color: aliceblue;
  position: relative;
  right: 0.5rem;
  bottom: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddGroupButton = styled.button`
  border-radius: 0.5rem;
  position: relative;
  width: 45px;
  height: 40px;
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
  width: 45px;
  height: 40px;
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
  width: 45px;
  height: 40px;
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
  width: 45px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  background: rgba(154, 155, 211, 0.2);
  svg {
      font-size: 1.7rem;
      color: aliceblue;
      display: inline;
  }
`;

const FriendInfo = React.forwardRef<HTMLDivElement, FriendInfoProps>((props, ref) => {
  useEffect(() => {
    console.log("FriendInfo Mounted:", props.id, props.username, props.profilePic);

    return () => {
      console.log("FriendInfo Unmounted");
    };
  }, [props.id, props.username, props.profilePic]);

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

  return (
  <div className="addChannelOverlay flex justify-center items-center ">
    <div ref={ref} className={styles['info-container']}>
      <div className={styles['info-picture']}>
        <img src={props.profilePic} alt="" className={styles['info-picture']}/>
      </div>
      <InfoName>
        <span >Snouae</span>
      </InfoName>
      <ButtonContainer>
        <AddGroupButton>
          <MdGroupAdd />
        </AddGroupButton>
      <GameButton>
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
  );
});

export default FriendInfo;