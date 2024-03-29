"use client"

import React, { Suspense } from 'react'
import styles from './friends.module.css'
import FriendItem from './FriendItem';
import { useState, useEffect } from 'react';
 
import { FaUserAstronaut } from "react-icons/fa6";
import styled from 'styled-components';
import { SocketUseContext } from "@/utils/socketUseContext";
import { connect, useSelector } from 'react-redux';

interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  status: string;
}

  interface FriendsProps {
    onFriendItemClick: any;
  }

  const NoFriendContainer = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15vh;
  color: #fff;
`;

const NoFriendsSpan = styled.span`
  font-size: 3vh;
`;

const NoFriendsIcon = styled.div`

font-size: 9vh;
  color: #fff;
`;

const FriendList: React.FC<FriendsProps> = ({onFriendItemClick}) => {
  const [FriendsList, setFriendsList] = useState<Friend[]>([]);
  const [FetchedFriendList, setFetchedFriendList] = useState<Friend[]>([]);
  const socket = React.useContext(SocketUseContext);
  const fetchFriends = useSelector((state: RootState) => state.booleans.fetchFriends);

  useEffect(() => {
    const fetchFriendsListData = async () => {
      try {
        const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL + "user/friends", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json() as Friend[];
          setFriendsList(data);
          setFetchedFriendList(data);
        }
      }
      catch (error) {
      }
    };
    fetchFriendsListData().then(() => {
        socket.on("friendStatus", (data: any) => {
        setFriendsList((prev) => {
          return prev.map((friend) => {
            if (friend.id === data.userId) {
              friend.status = data.status;
            }
            return friend;
          });
        });
      });
      socket.emit("getFriendStatus"); 
    });



    return () => {
      socket.off("friendStatus");
    }
  }, [socket, fetchFriends]);


  return (
    <div className={styles['friends-list']}>
    {FriendsList.length ? (
    <ul>
        {FriendsList.map((friend) => (
          <FriendItem
            key={friend.id}
            friend={friend}
            onFriendItemClick={onFriendItemClick}
        />
        ))}
    </ul> ) : (
      <NoFriendContainer>
        <NoFriendsIcon>
          <FaUserAstronaut />
        </NoFriendsIcon>
          <NoFriendsSpan>No friends yet</NoFriendsSpan>
      </NoFriendContainer>
    )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => 
{
  return {
    fetchFriends: state.booleans.fetchFriends,
  }
}

export default connect(mapStateToProps)(FriendList);