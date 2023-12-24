"use client"
import React, { use, useEffect, useState } from 'react'
import styles from './Match_History.module.css'
import MatchXp from './MatchXp';
import styled from 'styled-components';
import aoumad from "/goinfre/aoumad/ft_transcendence/frontend_service/frontend/src/app/(auth)/profile/imgs/snouae.jpeg"

interface MatchListProps {
    xp: number;
    scoredGoals: number;
    concededGoals: number;
    UserProfileStyling: boolean;
    opponnetProfilePic?: string;
    userProfilePic?: string;
}

const matchItemContainer = styled.div`
background: rgba(154, 155, 211, 0.20);
border-radius: 15px;
display: flex;
align-items: center;
width: 60vw;
box-sizing: border-box;
height: 7vh;
border-bottom: 1px solid rgba(154, 155, 211, 0.2);
margin: 30px 10px;
flex-direction: row;
flex-wrap: nowrap
`;

const UserProfileContainer = styled.div`
background: rgba(154, 155, 211, 0.20);
border-radius: 15px;
display: flex;
align-items: center;
width: 50vw;
box-sizing: border-box;
height: 7vh;
border-bottom: 1px solid rgba(154, 155, 211, 0.2);
margin: 30px 10px;
flex-direction: row;
flex-wrap: nowrap
`;

const MatchItem: React.FC<MatchListProps> = (props) => {
    const match = props;
    const UserProfileStyling = props.UserProfileStyling;
    useEffect(() => { 
        console.log('Simple useEffect');
      }, []);
    const ItemContainer = UserProfileStyling ? matchItemContainer : UserProfileContainer;
  return (
    <ItemContainer>
        <div className={styles['matchItem-player1']}>
            <img src={match.userProfilePic} alt="Profile" className="rounded-lg" />
        </div>
        <span className={styles['matchItem-vs']}>vs</span>
        <div className={styles['matchItem-player2']}>
            <img src={match.opponnetProfilePic} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['matchItem-result']}>
            <span className={styles['matchItem-result']}>{"Win"}</span>
        </div>
        <div className={styles['matchItem-scores']}>
            <span className={styles['matchItem-scores']}>{match.scoredGoals}</span>
            <span className={styles['matchItem-scores']}>-</span>
            <span className={styles['matchItem-scores']}>{match.concededGoals}</span>
        </div>
        <div className={styles['matchItem-xp']}>
            <MatchXp matchXp={match.xp} />
        </div>
    </ItemContainer>
  )
};

export default MatchItem;