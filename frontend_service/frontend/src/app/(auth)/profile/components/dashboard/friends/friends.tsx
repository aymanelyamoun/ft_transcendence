"use client";

import React, { useRef, useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Notification from '../Notification/Notification';
import styles from './friends.module.css';
import FriendList from './FriendList';
import FriendRequests from './FriendRequest';
import FriendInfo from '../FriendInfo/FriendInfo';


interface Friend {
  id: string;
  name: string;
  profilePic: string;
  title? : string;
}


const Friends  = () => {
  const [showRequest, setRequest] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleRequestClick = () => {
    setRequest((prevShowRequest) => !prevShowRequest);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (infoRef.current && !infoRef.current.contains(event.target as Node))
    {
      // Click outside the FriendInfo component, hide it
      setSelectedFriend(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <>
    <div className={styles.friends}>
      <div className={styles['friends-container']}>
        <span className={styles['friends-title']}>Friends</span>
        <Notification onRequestClick={handleRequestClick} />
        {showRequest ? (
          <FriendRequests 
          />
          ) : (
            <FriendList
              onFriendItemClick={setSelectedFriend}
            />
            )}
      </div>
    </div>
    {selectedFriend && (
        <FriendInfo
          id={selectedFriend.id}
          username={selectedFriend.name}
          profilePic={selectedFriend.profilePic}
          title={selectedFriend.title}
          ref={infoRef}
        />)}
      </>
  );
};

export default Friends;