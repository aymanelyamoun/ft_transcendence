import React from 'react';
import styles from './friends.module.css';
import MoreIcon from './more_icon';

interface Friend {
  id: string;
  name: string;
  profilePic: string;
  title? : string;
}

interface FriendItemProps {
  friend: Friend;
  onFriendItemClick: any; // Corrected callback function parameter type
}

const FriendItem: React.FC<FriendItemProps> = ({friend, onFriendItemClick}) => {
  return (
    <div className={styles['friendItem-container']}
    >
      <div className={styles['friend-image']}>
        <img src={friend.profilePic} alt="Profile" className="rounded-full" />
      </div>
      <div className={styles['friend-name']}>
        <span className={styles['friend-name']}>{friend.name}</span>
      </div>
      <MoreIcon onClick={() => onFriendItemClick(friend)}/>
    </div>
  );
};

export default FriendItem;