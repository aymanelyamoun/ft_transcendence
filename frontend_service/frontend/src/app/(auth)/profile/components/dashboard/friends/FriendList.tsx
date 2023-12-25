"use client"

import React, { Suspense } from 'react'
import styles from './friends.module.css'
import FriendItem from './FriendItem';
import { useState, useEffect } from 'react';
import { Backend_URL } from '@/lib/Constants';
import { FaUserAstronaut } from "react-icons/fa6";
import styled from 'styled-components';
import { SocketUseContext } from "../../../dashboard/page";

interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  status: string;
}

  interface FriendsProps {
    // onFriendItemClick: Friend | false;
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
  font-size: 1.5rem;
`;

const NoFriendsIcon = styled.div`

  font-size: 5rem;
  color: #fff;
`;

const FriendList: React.FC<FriendsProps> = ({onFriendItemClick}) => {
  const [FriendsList, setFriendsList] = useState<Friend[]>([]);
  const socket = React.useContext(SocketUseContext);

  useEffect(() => {
    const fetchFriendsListData = async () => {
      try {
        const res = await fetch( Backend_URL + "user/friends", {
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
        }
      }
      catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchFriendsListData();

  }, [setFriendsList]);

  // console
  useEffect(() => {
    socket.on("friendStatus", (data: any) => {
      console.log("Friend status changed");
      // console.log(data);
      // FriendsList.forEach((friend) => {
      //   if (friend.id === data.id) {
      //     friend.status = data.status;
      //   }
      // });
      // console.log("setting friends list");
      setFriendsList((prev) => {
        return prev.map((friend) => {
          if (friend.id === data.userId) {
            friend.status = data.status;
          }
          return friend;
        });
      });
    });
  });


  return (
    <div className={styles['friends-list']}>
      {/* <Suspense fallback={<p>Loading friends...</p>}> */}
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
      {/* </Suspense> */}
    </div>
  );
}

export default FriendList;