"use client"

import React, { useEffect, useState, ReactNode, useRef} from 'react';
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Skins from '../components/dashboard/skins/skins';
import Friends from '../components/dashboard/friends/friends';
import Statistics from '../components/dashboard/statistics/statistics';
import { Backend_URL } from '@/lib/Constants';
import SearchHeader from '../components/dashboard/Header/SearchHeader';
import styled from 'styled-components';
import Animation from '../components/dashboard/Animation/Animation';

import { socket } from "../../../../socket"
import EditProfileShow from '../components/dashboard/EditProfile/EditProfileShow';
import { StatisticsInterface } from '../components/dashboard/interfaces';



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
  grid-template-columns: 2rem 30rem auto 35rem 2rem;
  grid-template-rows: repeat(3, 1fr);
  z-index: auto;

  @media screen and (max-width: 1300px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;

export const SocketUseContext = React.createContext(socket);

function App() {

  const [ShowEditProfile, setShowEditProfile] = useState<boolean>(false);
  const EditRef = useRef<HTMLDivElement>(null);
  const [SidebarDone, setSidebarDone] = useState<boolean>(false);
  const [SidebarInfo, setSidebarInfo] = useState({
    id: "",
    username: "",
    title: "",
    profilePic: "",
    wallet: 0,
  });

  const [StatisticsProps, setStatisticsProps] = useState<StatisticsInterface>({
    wins: 0,
    losses: 0,
    total: 0,
  });

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`${Backend_URL}user/winsLoses/${SidebarInfo.username}`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        // console.log("username : ", SidebarInfo.username);
        // console.log("here" + res);
        // console.log("---------------------");
        const data = await res.json();
        setStatisticsProps(data);
        // console.log("data : ", data);
        // console.log("data statistics ylh bismillah : ", StatisticsProps);
          setSidebarDone(false);
      }
      else {
        console.log("----------error-----------");
        alert("error");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      // console.log("data statistics ylh  : ", StatisticsProps);
    }
  };
  
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    return () => {
      console.log("calling disconnect")
      socket.disconnect();
    }
  }, []);
  
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
        setSidebarDone(true);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally
    {
      setSidebarDone(true);
    }
  };


  
  useEffect(() => {
    fetchUserData();
    if (SidebarDone)
      fetchStatistics();
    // fetchReqData();
    // fetchUsers();
  }, [SidebarDone]);

  const handleClickOutside = (event: MouseEvent) => {
    if (EditRef.current && !EditRef.current.contains(event.target as Node))
    {
      // Click outside the FriendInfo component, hide it
      setShowEditProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])
  
  return (
    <>
      {ShowEditProfile && <EditProfileShow />}
      <div className="App">
        <SocketUseContext.Provider value={socket}>
          <SearchDiv >
            <SearchHeader />
          </SearchDiv>
          <AppGlass>
            <Sidebar sidebar={SidebarInfo} ShowSettings={true} setShowEditProfile={setShowEditProfile}/>
            <Skins />
            <Animation />
            <Statistics statistics={StatisticsProps} />
            <Friends
            />
          </AppGlass>
        </SocketUseContext.Provider>
      </div>
    </>
  );
};

export default App;