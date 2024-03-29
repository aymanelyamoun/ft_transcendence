"use client"

import React from 'react';
import styles from './friends.module.css';
import FriendRequestItem from './FriendRequestItem';
import { useState, useEffect } from 'react';
 
import { GiAstronautHelmet } from "react-icons/gi";
import styled from 'styled-components';

interface FriendR
{
  id: string;
  title: string;
  sender: {
    profilePic: string;
  };
  discription: string;
}

const NoRequestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15vh;
  color: #fff;
`;

const NoRequestIcon = styled.div`
  font-size: 9vh;
  color: #fff;
`;

const NoRequestSpan = styled.span`
  font-size: 3vh;
`;

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState<FriendR[]>([]);
  const [refreshRequest, setRefreshRequest] = useState<boolean>(false);

  useEffect(() => {
    const fetchReqData = async () => {
      try {
        const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL + "user/notifications", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json() as FriendR[];
          setFriendRequests(data);
        }
      } catch (error)
      {
      }
    };
    fetchReqData();
  },[refreshRequest]);

  return (
    <div className={styles['friendRequest']}>
      {friendRequests.length ? (
      <ul>
        {friendRequests.map((friendRequest) => (
          <FriendRequestItem
            key={friendRequest.id}
            id={friendRequest.id}
            title={friendRequest.title}
            discription={friendRequest.discription}
            profilePic={friendRequest.sender.profilePic}
            setfriendRequests={setFriendRequests}
            refreshRequest={refreshRequest}
            setRefreshRequest={setRefreshRequest}
          />
        ))}
      </ul> ) : (
        <NoRequestsContainer>
          <NoRequestIcon>
            <GiAstronautHelmet />
          </NoRequestIcon>
          <NoRequestSpan>No Requests yet</NoRequestSpan>
        </NoRequestsContainer>
      )}
    </div>
  );
}

export default FriendRequest;