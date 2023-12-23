"use client"

import React, { useEffect, useState, ReactNode} from 'react';
import styled from 'styled-components'
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Match_History from '../components/statistics/Match_History/Match_History';
import aoumad from '../imgs/aoumad.jpeg';
import yamon from '../imgs/ael-yamo.jpeg';
import Statistics from '../components/dashboard/statistics/statistics';

interface Match {
  id: string;
  player1_profile: string;
  player2_profile: string;
  player1_score: number;
  player2_score: number;
  result: string;
  xp: number;
}
interface pageProps {
  matches: Match[];
}

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

    const [SidebarInfo, setSidebarInfo] = useState({
        id: "",
        username: "",
        title: "",
        profilePic: "",
        wallet: 0,
    });


  return (
    <App>
        <AppGlass>
            <Sidebar sidebar={SidebarInfo} ShowSettings={false} />
            <MatchesContainer>
              <Match_History matches={matches_history} UserProfileStyling={true}/>
            </MatchesContainer>
            <Statistics />
        </AppGlass>
    </App>
  )
}

export default page;