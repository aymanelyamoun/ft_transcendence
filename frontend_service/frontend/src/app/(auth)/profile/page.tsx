"use client"

import React, { useEffect, useState, ReactNode, useRef} from 'react';
import Sidebar from './components/dashboard/sidebar/sidebar';
import Skins from './components/dashboard/skins/skins';
import Friends from './components/dashboard/friends/friends';
import Statistics from './components/dashboard/statistics/statistics';
 
import SearchHeader from './components/dashboard/Header/SearchHeader';
import styled from 'styled-components';
import Animation from './components/dashboard/Animation/Animation';

import { socket } from "../../../socket"
import EditProfileShow from './components/dashboard/EditProfile/EditProfileShow';
import { StatisticsChartInterface, StatisticsPieInterface } from './components/dashboard/interfaces';
import { useRouter } from "next/navigation";
import { useUser } from '../layout';

import { Provider } from 'react-redux'
import { AlertMessage } from '../chat/components/alertMessage';
import store from '@/store';
import './globals.css'

const NavRoot = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
`;


const SearchDiv = styled.div`
  position: absolute;
  top: 1vh;
  left: 7vw;
`;

const AppGlass = styled.div`
@media (min-width: 1900px) {
  display: grid;
  height: 90%;
  width: 90%;
  border-radius: 2rem;
  overflow: hidden;
  grid-column-start: 1;
  grid-column-end: 5;
  grid-template-columns: 2rem 30rem auto 35rem 2rem;
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  bottom: 4vh;
  z-index: auto;
}

  @media (min-width: 1000px) and (max-width: 1900px) {
    display: grid;
    height: 90%;
    width: 90%;
    border-radius: 2rem;
    overflow: hidden;
    grid-column-start: 1;
    grid-column-end: 5;
    grid-template-columns: 2rem 17rem auto 22rem 2rem;
    grid-template-rows: repeat(3, 1fr);
    z-index: auto;
  }

  @media screen and (max-width: 1000px) {
    display: grid;
    height: 90%;
    width: 90%;
    border-radius: 2rem;
    overflow: hidden;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto 11rem 19rem;
    z-index: auto;
  }
`;
interface InviteInterface {
  id: string;
  username: string;
}

function App() {

  const [PlayPopUp , setplayPopUp] = useState<boolean>(false);
  const popUpTimeout = useRef<NodeJS.Timeout>(null!);
  const [ShowEditProfile, setShowEditProfile] = useState<boolean>(false);
  const inviterData = useRef<InviteInterface>(null!);
  const [PieDone, setPieDone] = useState<boolean>(false);
  const [ChartDone, setChartDone] = useState<boolean>(false);
  const [SidebarInfo, setSidebarInfo] = useState({
    id: "",
    username: "",
    title: "",
    profilePic: "",
    wallet: 0,
    totalXp: 0,
  });

  const [statisticsPieProps, setStatisticsPieProps] = useState<StatisticsPieInterface>({
    wins: 0,
    losses: 0,
    total: 0,
  });
  const [statisticsChartProps, setStatisticsChartProps] = useState<StatisticsChartInterface>({
    daysOfWeek: [],
  });

  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>();
  const user = useUser();
  useEffect(() => {
    const checkAuthentication = async () => {
        if (user) {
          setUsername(user.username);
        }
    };
    checkAuthentication();
  }, [user, router]); 

  
  useEffect(() => {
    socket.connect();
    socket.on('gameInvite', (data : any) => {
      inviterData.current = data;
      setplayPopUp(true);
      popUpTimeout.current = setTimeout(() => {
        setplayPopUp(false);
      }, 10000);
    })

    socket.on('gameInviteAccepted', (data : any) => {
    })
    socket.on('redirect', (destination : any) => {
      router.push(destination)
    })
    return () => {
      socket.off('redirect')
      socket.off('gameInvite');
      socket.off('gameInviteAccepted');
      socket.disconnect();
    }
  }, [router]);
  

  useEffect(() => 
  {
    const fetchStatisticsPie = async () => 
    {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/winsLoses/${username}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        const data = await res.json();
        setStatisticsPieProps(data);
        setPieDone(false);
      } catch (error) {
      } finally
      {
        setPieDone(true);
      }
    };
  
    const fetchStatisticsChart = async () => 
    {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/games/week/${username}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok)
        {
          const data = await res.json();
          setStatisticsChartProps(data);
        }
      } catch (error) {
      } finally
      {
        setChartDone(true);
      }
    };
    
    const fetchUserData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"user/profile", {
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
      }
    };

    fetchUserData();
    if (username)
    {
      fetchStatisticsPie();
      fetchStatisticsChart();
    }
  }, [PieDone, ChartDone, username]);
  
  return (
    <> 
    {/* <Provider store={store}> */}
      {ShowEditProfile && <EditProfileShow onClose={() => setShowEditProfile(false)} />}
       <div className="App">
        {PlayPopUp && (<AlertMessage onClick={() => setplayPopUp(false)} message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`} type="wannaPlay" id={`${inviterData.current.id}`}/>)}
          <SearchDiv >
            <SearchHeader />
          </SearchDiv>
          <AppGlass>
            <Sidebar dashboard={true} sidebar={SidebarInfo} ShowSettings={true} setShowEditProfile={setShowEditProfile}/>
            <Skins />
            <Animation />
            {PieDone && ChartDone &&
                <Statistics StatisticsPie={statisticsPieProps} StatisticsChart={statisticsChartProps} UserProfile={false}/>
                }
            <Friends/>
          </AppGlass>
      </div>
      {/* </Provider> */}
    </>
  );
};

export default App;