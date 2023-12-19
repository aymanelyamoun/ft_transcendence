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
  left: 7vw;
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
  });

 
  
  // const [SearchUsers, setSearchUsers] = useState<SearchU[]>([]);
  // const [AcceptRequest, setAcceptRequest] = useState<FriendR>([]);


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


  
  useEffect(() => {
    fetchUserData();
    // fetchReqData();
    // fetchUsers();
  }, []);
  

  return (
    <>
      <div className="App">
        <SearchDiv >
          <SearchHeader />
        </SearchDiv>
        <AppGlass>
          <Sidebar sidebar={SidebarInfo} />
          <Skins />
          <Statistics />
          <Friends
          />
        </AppGlass>
      </div>
    </>
  );
};

export default App;