"use client"

import React, { useEffect, useState, ReactNode, useRef} from 'react';
import styled from 'styled-components'
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Match_History from '../components/statistics/Match_History/Match_History';
import Statistics from '../components/dashboard/statistics/statistics';
 
import { Match } from '../components/statistics/Match_History/match_history_interfaces';
import { StatisticsChartInterface, StatisticsPieInterface } from '../components/dashboard/interfaces';
import { useRouter } from "next/navigation";
import { useUser } from '../../layout';
import { Provider } from 'react-redux';
import store from '@/store';
import { socket } from '@/socket';
import { AlertMessage } from '../../chat/components/alertMessage';
interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  hash: string;
  typeLog: string;
  isTwoFactorEnabled: Boolean;
} // use the exported interface instead

// interface Match {
//   id: string;
//   username: string;
//   profilePic: string;
//   gameRecords: {
//       xp: number;
//       scoredGoals: number;
//       concededGoals: number;
//   }[]
// }

var username : any;
const Root = styled.div`
    background: rgba(5, 10, 39, 1);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    z-index: auto;
`;

const RootGlass = styled.div`
display: grid;
height: 90%;
width: 90%;
border-radius: 2rem;
overflow: hidden;
grid-column-start: 1;
grid-column-end: 5;
grid-template-columns: 30rem auto;
grid-template-rows: 45rem auto;
z-index: auto;

  // @media screen and (max-width: 1300px) {
  //   grid-template-columns: 1fr;
  //   grid-template-rows: repeat(4, 1fr);
  // }
`;

const MatchesContainer = styled.div`
    grid-row-start: 1;
    grid-column-start: 2;
    position: relative;
`;

function App() {
  const router = useRouter();
  const [playPopUp, setplayPopUp] = useState<boolean>(false);
  const popUpTimeout = useRef<NodeJS.Timeout>(null!);
  const inviterData = useRef<User>(null!);
  useEffect(() => {
    socket.connect()
    socket.on('redirect', (destination : string) => {
      router.push(destination)
    })
    socket.on('gameInvite', (data : any) => {
      inviterData.current = data;
      setplayPopUp(true);
      popUpTimeout.current = setTimeout(() => {
        setplayPopUp(false);
      }, 10000);
    })
    return () => {
        socket.disconnect();
        socket.off('redirect')
        socket.off('gameInvite');
      }
  }, [router])
  useEffect(() => {
    // Get the query string from the URL
    
    
    // Parse the query string to get an object with key-value pairs
    // Access individual query parameters
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    username = queryParams.get('username');
  }, []);
  const [ShowEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [PieDone, setPieDone] = useState<boolean>(false);
  const [ChartDone, setChartDone] = useState<boolean>(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [SidebarInfo, setSidebarInfo] = useState({
      id: "",
      username: "",
      title: "",
      profilePic: "",
      wallet: 0,
      totalXp: 0,
    });

    const [IsMatchLoading, setIsMatchLoading] = useState<boolean>(false);
    const [matchHistory, setMatchHistory] = useState({
          id: "",
          username: "",
          title: "",
          profilePic: "",
          wallet: 0,
          gameRecords : []
      });


    const fetchSidebar = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/profil/${username}`, {
              method: "GET",
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
            if (res.ok) { 
              const parseData = await res.json();
              setSidebarInfo(
                parseData
                // id: parseData.id,
                // username: parseData.username,
                // title: parseData.title,
                // profilePic: parseData.profilePic,
                // wallet: parseData.wallet,
                // gameRecords : parseData.gameRecords,
                );
                setIsLoading(true);
                
            } else {
              alert("error"); 
            }

            } catch (err) {
              console.log(err);
            } finally {
              setIsLoading(true);
            }
    }
    useEffect(() => {
       fetchSidebar(); 
    }, [IsLoading]);

  const [statisticsPieProps, setStatisticsPieProps] = useState<StatisticsPieInterface>({
    wins: 0,
    losses: 0,
    total: 0,
  });
  const [statisticsChartProps, setStatisticsChartProps] = useState<StatisticsChartInterface>({
    daysOfWeek: [],
  });

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
      console.error("Error fetching data: ", error);
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
        // setChartDone(true);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally
    {
      setChartDone(true);
    }
  };

  const fetchMatchHistory = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/profil/${username}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) { 
          const parseData = await res.json();
          setMatchHistory(parseData);
          setIsMatchLoading(false);
        } else {
          alert("Match History fetching isn't okay"); 
        }
        } catch (err) {
          console.log(err);
        } finally {
          setIsMatchLoading(true);
        }
}


  useEffect(() => 
  {
    if (username)
    {
      fetchMatchHistory();
      fetchStatisticsPie();
      fetchStatisticsChart();
    }
  }, [PieDone, ChartDone, IsMatchLoading]);

    return (
      <>
      {playPopUp && (<AlertMessage onClick={() => setplayPopUp(false)}
        message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`}
        type="wannaPlay" id={`${inviterData.current.id}`}/>)}
      <Provider store={store}>
        <Root>
          <RootGlass>
          {IsLoading &&
            <Sidebar dashboard={false} sidebar={SidebarInfo} ShowSettings={false} setShowEditProfile={setShowEditProfile}/>
          }
          <MatchesContainer>
          {IsMatchLoading && 
                <Match_History matches={matchHistory.gameRecords} UserProfileStyling={true}/>
          }
          </MatchesContainer>
          {PieDone && ChartDone &&
            <Statistics StatisticsPie={statisticsPieProps} StatisticsChart={statisticsChartProps} UserProfile={true}/>
            }
          </RootGlass>
        </Root>
      </Provider>
    </>
  )
}

export default App;