"use client"
import React, { useState } from 'react'
import styles from './Match_History.module.css'
import MatchXp from './MatchXp';
import styled from 'styled-components';

interface Match {
    id: string;
    player1_profile: string;
    player2_profile: string;
    player1_score: number;
    player2_score: number;
    result: string;
    xp: number;
    UserProfileStyling: boolean;
}

interface MatchListProps {
    matches: Match[];
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

const MatchItem: React.FC<Match> = (props) => {
    const UserProfileStyling = props.UserProfileStyling;

    const ItemContainer = UserProfileStyling ? matchItemContainer : UserProfileContainer;
  return (
    <ItemContainer>
        <div className={styles['matchItem-player1']}>
            <img src={props.player1_profile} alt="Profile" className="rounded-lg" />
        </div>
        <span className={styles['matchItem-vs']}>vs</span>
        <div className={styles['matchItem-player2']}>
            <img src={props.player2_profile} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['matchItem-result']}>
            <span className={styles['matchItem-result']}>{props.result}</span>
        </div>
        <div className={styles['matchItem-scores']}>
            <span className={styles['matchItem-scores']}>{props.player1_score}</span>
            <span className={styles['matchItem-scores']}>-</span>
            <span className={styles['matchItem-scores']}>{props.player2_score}</span>
        </div>
        <div className={styles['matchItem-xp']}>
            <MatchXp matchXp={props.xp} />
        </div>
    </ItemContainer>
  )
};

export default MatchItem;