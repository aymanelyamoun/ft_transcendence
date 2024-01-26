"use client"

import React from 'react';
import styles from './friends.module.css';
import MoreIcon from './more_icon';
import styled from 'styled-components';
import { FaGamepad } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import Friends from './friends';

interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  status: string;
}

interface FriendItemProps {
  friend: Friend;
  onFriendItemClick: any; // Corrected callback function parameter type
}

const MoreIconStyle = styled.div`
margin-left: auto;
position: relative;
top: 0.5vh;
  `;

  
  const ContainerStatus = styled.div<{ status: string }>`
  position: relative;
  top: 1.4vh;
  right: 0.7vw;
  
  ${({ status }) =>
  status === '2' &&
  `
    svg {
      color: blue;
    }
  `}

${({ status }) =>
  status === '0' &&
  `
    svg {
      color: grey;
    }
  `}

${({ status }) =>
  status === '1' &&
  `
    svg {
      color: green;
    }
  `}
  `;
  
  const IconContainer = styled.div<{ status: string }>`
  border-radius: 20px;
  width: 15px;
  height: 15px;
  // position: absolute;
   
  ${({ status }) =>
    status === '2' &&
    `
      svg {
        color: green;
      }
    `}

  ${({ status }) =>
    status === '0' &&
    `
      svg {
        color: grey;
      }
    `}

  ${({ status }) =>
    status === '1' &&
    `
      svg {
        color: green;
      }
    `}
`;

  const FriendItem: React.FC<FriendItemProps> = ({friend, onFriendItemClick}) => {
    // console.log('friend ' + friend.username + ' status: ' + friend.status);
  // const IconContainer = friend.status === "2" ? <FaGamepad color="green" /> : (friend.status === "0" ? <BsCircleFill color="grey"/> : <BsCircleFill color="green"/>);

  // const IconContainer = friend.status === "2" ? FaGamepad : (friend.status === "0" ? BsCircleFill : BsCircleFill);
  return (
    <div className={styles['friendItem-container']}
    >
      <div className={styles['friend-image']}>
        <img src={friend.profilePic} alt="Profile" className="rounded-full" />
      </div>
      <ContainerStatus status={friend.status}>
      <IconContainer status={friend.status}></IconContainer>
      </ContainerStatus>
      <div className={styles['friend-name']}>
        <span className={styles['friend-name']}>{friend.username}</span>
      </div>
      <MoreIconStyle>
      <MoreIcon onClick={() => onFriendItemClick(friend)}/>
      </MoreIconStyle>
    </div>
  );
};

export default FriendItem;