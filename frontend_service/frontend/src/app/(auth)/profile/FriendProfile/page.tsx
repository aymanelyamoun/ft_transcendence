"use client"

import React, { useEffect, useState, ReactNode} from 'react';
import styled from 'styled-components'
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Match_History from '../components/statistics/Match_History/Match_History';
import aoumad from '../imgs/aoumad.jpeg';
import yamon from '../imgs/ael-yamo.jpeg';
import Statistics from '../components/dashboard/statistics/statistics';
import { Backend_URL } from '@/lib/Constants';
import { useRouter } from 'next/router'
import { Match } from '../components/statistics/Match_History/match_history_interfaces';

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
interface pageProps {
  matches: Match[];
}

var username : any;
const App = styled.div`
    background: rgba(5, 10, 39, 1);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    z-index: auto;
`;

const AppGlass = styled.div`
  display: grid;
  height: 90%;
  width: 90%;
  border-radius: 2rem;
  overflow: hidden;
  grid-column-start: 1;
  grid-column-end: 5;
  grid-template-columns: 2rem 30rem auto;
  grid-template-rows: repeat(3, 1fr);
  z-index: auto;

  @media screen and (max-width: 1300px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;

const MatchesContainer = styled.div`
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 3;
`;

const page: React.FC<pageProps> = () => {

  useEffect(() => {
    // Get the query string from the URL
    const queryString = window.location.search;

    // Parse the query string to get an object with key-value pairs
    const queryParams = new URLSearchParams(queryString);
    
    // Access individual query parameters
    username = queryParams.get('username');
  }, []);
  const matches_history = [
    { id: "1", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
    { id: "2", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
    { id: "3", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
    { id: "4", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
    { id: "5", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
    { id: "6", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
    { id: "7", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
    { id: "8", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
  ];

  /**{"id":"c1be77d1-df40-4a3c-8f50-8c2c90ed19d3","email":"aoumad@student.1337.ma","hash":"$2b$10$BHPPJNPPcT2yvfQNuGUsduBxyfBuls41iBydA7VtwR0q9ySceM7li","profilePic":"https://cdn.intra.42.fr/users/080cb88649236ca06ede61155d2bf3cb/aoumad.jpg","username":"aoumad","TwoFactSecret":null,"title":"snouae rfa3 ta7di","wallet":30,"typeLog":"intralog","isFirstLog":false,"isTwoFactorEnabled":null,"totalXp":50,"mutedId":null,
  "gameRecords":[{"id":"a9c80105-191c-45bf-9fc2-ea40ff9b6676","userId":"c1be77d1-df40-4a3c-8f50-8c2c90ed19d3","xp":25,"scoredGoals":2,"concededGoals":1,"oponentId":"cd3878c5-4afa-4f4c-b44c-b08be7d37d06","oponent":{"profilePic":"https://cdn.intra.42.fr/users/c06c0753f8262f275a233097381d0190/snouae.jpg"}},{"id":"d1c77b5e-0eb6-45fa-9a90-949c8db5069f","userId":"c1be77d1-df40-4a3c-8f50-8c2c90ed19d3","xp":25,"scoredGoals":2,"concededGoals":1,"oponentId":"cd3878c5-4afa-4f4c-b44c-b08be7d37d06","oponent":{"profilePic":"https://cdn.intra.42.fr/users/c06c0753f8262f275a233097381d0190/snouae.jpg"}}]} */
  const [IsLoading, setIsLoading] = useState(false);
  const [SidebarInfo, setSidebarInfo] = useState({
        id: "",
        username: "",
        title: "",
        profilePic: "",
        wallet: 0,
        gameRecords : []
    });


    const fetchSidebar = async () => {
        try {
            const res = await fetch(`${Backend_URL}user/profil/${username}`, {
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
              console.log('parseData');
              // console.log(parseData);
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
                
                // console.log(SidebarInfo);
            } else {
              alert("error"); 
            }

            } catch (err) {
              console.log(err);
            } finally {
              setIsLoading(true);
            }
            // {console.log(username)}
    }
    useEffect(() => { fetchSidebar(); 
      // console.log('after fetch');
      // console.log(SidebarInfo);
      // console.log('----------');
    }, [!IsLoading]);
    return (
      <App>
        <AppGlass>
          {IsLoading ? (
            <><Sidebar sidebar={SidebarInfo} ShowSettings={false} /><MatchesContainer>
              <Match_History matches={SidebarInfo.gameRecords} UserProfileStyling={true} />
            </MatchesContainer><Statistics /></> ): null
          }
        </AppGlass>
    </App>
  )
}

export default page;