import React from 'react';
import styles from './friends.module.css';
import FriendRequestItem from './FriendRequestItem';
import { useState, useEffect } from 'react';
import { Backend_URL } from '@/lib/Constants';

interface FriendR
{
  id: string;
  title: string;
  sender: {
    profilePic: string;
  };
  discription: string;
}


const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState<FriendR[]>([]);

  useEffect(() => {
    const fetchReqData = async () => {
      try {
        const res = await fetch( Backend_URL + "user/notifications", {
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
        console.error("Error fetching data: ", error);
      }
    };
    fetchReqData();
  },[]);

  return (
    <div className={styles['friendRequest']}>
      <ul>
        {friendRequests.map((friendRequest) => (
          <FriendRequestItem
            key={friendRequest.id}
            id={friendRequest.id}
            title={friendRequest.title}
            discription={friendRequest.discription}
            profilePic={friendRequest.sender.profilePic}
            setfriendRequests={setFriendRequests}
          />
        ))}
      </ul>
    </div>
  );
}

export default FriendRequest;