"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './Match_History.module.css'
import MatchList from './MatchList';
import styled from 'styled-components';
import { Match } from './match_history_interfaces';
import { MatchProps } from './match_history_interfaces';


const MatchesUserProfiles = styled.div`
background: var(--linear-blue_purble, linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%));
width: 93%;
margin: 0 auto 0 1.5vw;
height: 96%;
border-radius: 15px;
display: flex;
justify-content: space-evenly;
align-items: flex-start;
font-family: 'Inter',sans-serif;
position: relative;
z-index: auto;
overflow: hidden;
flex-direction: column;
`;

const StandardMatches = styled.div`
background: var(--linear-blue_purble, linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%));
width: 90.5%;
height: 62.2%;
border-radius: 15px;
display: flex;
justify-content: space-evenly;
align-items: flex-start;
font-family: 'Inter', sans-serif;
position: relative;
left: 3vw;
z-index: auto;
overflow: hidden;
flex-direction: column;
`;

const MatchListStandard = styled.div`
    position: relative;
    width: 100%;
    height: 57.5vh;
    overflow: auto;
    left: 0.6rem;
`;

const MatchListUser = styled.div`
position: relative;
width: 100%;
height: 57.5vh;
overflow: auto;
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