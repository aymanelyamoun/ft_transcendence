"use client"

import React, { useEffect, useState, ReactNode} from 'react';
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Skins from '../components/dashboard/skins/skins';
import Friends from '../components/dashboard/friends/friends';
import Achievement from '../components/dashboard/achievements/achievement';
import Statistics from '../components/dashboard/statistics/statistics';
import { Backend_URL } from '@/lib/Constants';
import SearchHeader from '../components/dashboard/Header/SearchHeader';
import styled from 'styled-components';

interface FriendL
{
  id: string;
  name: string;
  profilePic: string;
}

interface FriendR
{
  id: string;
  title: string;
  sender: {
    profilePic: string;
  };
  discription: string;
}

interface SearchU
{
    id: number;
    username: string;
    profilePic: string;
    group: boolean;
    groupMembers?: string[];
}

const SearchDiv = styled.div`
  position: absolute;
  top: 1vh;
  left: 5vw;
`;

const AppGlass = styled.div`
  display: grid;
  height: 90%;
  width: 90%;
  border-radius: 2rem;
  overflow: hidden;
  grid-column-start: 1;
  grid-column-end: 5;
  grid-template-columns: 2rem 30rem auto 40rem 2rem;
  grid-template-rows: repeat(3, 1fr);
  z-index: auto;
`;


function App() {

  const [SidebarInfo, setSidebarInfo] = useState({
    id: "",
    username: "",
    title: "",
    profilePic: "",
    wallet: 0,
    online: false,
  });

  const [FriendsList, setFriendsList] = useState<FriendL[]>([]);
  const [FriendRequestsInfo, setFriendRequestsInfo] = useState<FriendR[]>([]);
  const [SearchUsers, setSearchUsers] = useState<SearchU[]>([]);
  // const [AcceptRequest, setAcceptRequest] = useState<FriendR>([]);

  const acceptFriendRequest = async (notificationid: string) => {
    try {
      const res = await fetch( `Backend_URL + request/accept/${notificationid}`, 
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
      );
      if (res.ok) {
        const data = await res.json();
        setFriendRequestsInfo(data);
      } else {
        console.error("Error accepting friend request", res.statusText);
      }
    }
    catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const refuseFriendRequest = async (notificationid: string) => {
    try {
      const res = await fetch( `Backend_URL + request/Refuse/${notificationid}`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
      );
      if (res.ok)
      {
        const data = await res.json();
        setFriendRequestsInfo(data);
      } else {
        console.error("Error accepting friend request", res.statusText);
      }
    }
    catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSidebarInfo(data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

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
        const data = await res.json() as FriendL[];
        setFriendsList(data);
      }
    }
    catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

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
        setFriendRequestsInfo(data);
      }
    
    } catch (error)
    {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch( Backend_URL + "user/all", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json() as SearchU[];
        console.log(data);
        setSearchUsers(data);
      }else {
        alert("Error fetching data: ");
        console.error("Error fetching data: ", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    fetchReqData();
    fetchFriendsListData();
    fetchUsers();
  }, []);
  

  return (
    <>
      <div className="App">
        <SearchDiv >
          <SearchHeader onSearch={() => {}}  onClose={() => {}} searchUsers={SearchUsers} />
        </SearchDiv>
        <AppGlass>
          <Sidebar sidebar={SidebarInfo} />
          <Skins />
          <Statistics />
          <Friends
          friends={FriendsList} 
          friendsReq={FriendRequestsInfo} 
          acceptRequest={acceptFriendRequest}
          refuseRequest={refuseFriendRequest}
          // onFriendItemClick={handleFriendItemClick} 
          />
        </AppGlass>
      </div>
    </>
  );
};

export default App;