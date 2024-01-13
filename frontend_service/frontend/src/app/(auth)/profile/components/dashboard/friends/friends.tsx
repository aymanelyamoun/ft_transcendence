"use client";

import React, { useRef, useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Notification from '../Notification/Notification';
import styles from './friends.module.css';
import FriendList from './FriendList';
import FriendRequests from './FriendRequest';
import FriendInfo from '../FriendInfo/FriendInfo';
import { connect } from 'react-redux';
import { toggleShowGroups } from '@/features/booleans/booleanActions';
import ShowGroups from '../FriendInfo/ShowGroups';

interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  status: string;
}

interface FriendProps {
  showGroups: boolean;
  onClose: () => void;
}


const Friends: React.FC<FriendProps>  = ({ showGroups }) => {
  const [showRequest, setRequest] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(false);
  const [closeGroups, setCloseGroups] = useState(false);
  // const infoRef = useRef<HTMLDivElement>(null);

  const handleRequestClick = () => {
    setRequest((prevShowRequest) => !prevShowRequest);
  };

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (infoRef.current && !infoRef.current.contains(event.target as Node))
  //   {
  //     // Click outside the FriendInfo component, hide it
  //     setSelectedFriend(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   }
  // });
  // useEffect(() => {
  //   console.log("ShowGroups: ", showGroups);
  // }, [showGroups]);

  return (
    <>
    <div className={styles.friends}>
      <div className={styles['friends-container']}>
        {showRequest ? (
          <span className={styles['friends-title']}>Friend Requests</span>
          ) : (
            <span className={styles['friends-title']}>Friends</span>
            )}
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
          username={selectedFriend.username}
          profilePic={selectedFriend.profilePic}
          title={selectedFriend.title}
          // setSelectedFriend={setSelectedFriend}
          onClose={() => setSelectedFriend(false)}
          // ref={infoRef}
        />)}
    { showGroups &&
    <ShowGroups 
      onClose={() => setSelectedFriend(false)}
      />}
      </>
  );
};

const mapStateToProps = (state : RootState) => {
  return {
    showGroups: state.booleans.showGroups,
  };
};

const mapDispatchToProps = {
  toggleShowGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);