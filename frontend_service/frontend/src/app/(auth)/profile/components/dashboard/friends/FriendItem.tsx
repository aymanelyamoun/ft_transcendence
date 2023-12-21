import React from 'react';
import styles from './friends.module.css';
import MoreIcon from './more_icon';
import styled from 'styled-components';

interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  online: boolean;
}

interface FriendItemProps {
  friend: Friend;
  onFriendItemClick: any; // Corrected callback function parameter type
}

const MoreIconStyle = styled.div`
  margin-left: auto;
  margin-righ: auto;
  `;

  const OnlineStatus = styled.div`
  border-radius: 20px;
  width: 15px;
  height: 15px;
  position: absolute;
  background-color: #ccc;
  // background-color: #4CAF50;

  ${friend => friend.online && `
    /* Green color if online is true */
    background-color: #4CAF50;
  `}
`;

const FriendItem: React.FC<FriendItemProps> = ({friend, onFriendItemClick}) => {
  return (
    <div className={styles['friendItem-container']}
    >
      <div className={styles['friend-image']}>
        <img src={friend.profilePic} alt="Profile" className="rounded-full" />
        <OnlineStatus online={friend.online}></OnlineStatus>
      </div>
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