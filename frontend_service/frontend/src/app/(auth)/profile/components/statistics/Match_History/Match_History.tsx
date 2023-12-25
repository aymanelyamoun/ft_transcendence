"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './Match_History.module.css'
import MatchList from './MatchList';
import styled from 'styled-components';
import { Match } from './match_history_interfaces';
import { MatchProps } from './match_history_interfaces';


const MatchesUserProfiles = styled.div`
background: var(--linear-blue_purble, linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%));
height: 56vh;
width: 68vw;
border-radius: 15px;
display: flex;
align-items: center;
font-family: 'Inter',sans-serif;
position: relative;
top: 4vh;
left: 1vw;
z-index: auto;
overflow: auto;
`;

const StandardMatches = styled.div`
background: var(--linear-blue_purble, linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%));
height: 60vh;
width: 90.5%;
border-radius: 15px;
display: flex;
/* justify-content: center; */
align-items: center;
font-family: 'Inter', sans-serif;
position: relative;
top: 1vh;
left: 3vw;
z-index: auto;
overflow: auto;
`;

const MatchListStandard = styled.div`
position: relative;
top: 6vh;
left: 0.7vw;
`;

const MatchListUser = styled.div`
    position: relative;
    left: 0.7vw;
`;

const Match_History: React.FC<MatchProps> = (props) => {
    const UserProfileStyling = props.UserProfileStyling;
    const matches = props.matches;
    const Container = UserProfileStyling
    ? MatchesUserProfiles
    : StandardMatches;
    const ContainerList = UserProfileStyling
    ? MatchListUser
    : MatchListStandard;

    useEffect(() => {
        console.log("abababab" + props.matches);
      },[]);

  return (
    // <div className={styles['matchesClassName']}>
    <Container>
        <div className={styles['match-title']}>
            <span >Match History</span>
        </div>
        <ContainerList>
            <MatchList matches={matches} UserProfileStyling={UserProfileStyling}/>
        </ContainerList>
    </Container>
  )
}

export default Match_History;


{/* <div className={styles['matchesClassName']}>
{UserProfileStyling ? (
    <MatchesUserProfiles>
        <div className={styles['match-title']}>
            <span>Match History</span>
        </div>
        <div className={styles['match-list']}>
            <MatchList matches={matches}/>
        </div>
    </MatchesUserProfiles>
) : (
    <>
        <div className={styles['match-title']}>
            <span>Match History</span>
        </div>
        <div className={styles['match-list']}>
            <MatchList matches={matches}/>
        </div>
    </> */}