"use client"
import React, { use, useEffect, useState } from 'react'
import styles from './Match_History.module.css'
import MatchXp from './MatchXp';
import styled from 'styled-components';
import Image from 'next/image';

interface MatchListProps {
    xp: number;
    scoredGoals: number;
    concededGoals: number;
    UserProfileStyling: boolean;
    opponnetProfilePic: string;
    userProfilePic: string;
}

const matchItemContainer = styled.div`
background: rgba(154, 155, 211, 0.20);
border-radius: 15px;
display: flex;
align-items: center;
width: 90%;
box-sizing: border-box;
height: 5.5rem;
border-bottom: 1px solid rgba(154, 155, 211, 0.2);
margin: 30px 10px;
flex-direction: row;
flex-wrap: nowrap;
`;

const UserProfileContainer = styled.div`
background: rgba(154, 155, 211, 0.20);
border-radius: 15px;
display: flex;
align-items: center;
width: 90%;
box-sizing: border-box;
height: 5.5rem;
border-bottom: 1px solid rgba(154, 155, 211, 0.2);
margin: 30px 10px;
flex-direction: row;
flex-wrap: nowrap;
`;

const MatchItem: React.FC<MatchListProps> = (props) => {
    const match = props;
    const UserProfileStyling = props.UserProfileStyling;
    const ItemContainer = UserProfileStyling ? matchItemContainer : UserProfileContainer;

  return (
    <ItemContainer>
        <div className={styles['matchItem-player1']}>
            <Image src={match.userProfilePic} alt="Profile" className="rounded-lg" />
        </div>
        <span className={styles['matchItem-vs']}>vs</span>
        <div className={styles['matchItem-player2']}>
        <Image src={match.opponnetProfilePic} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['matchItem-result']}>
            {match.scoredGoals > match.concededGoals ? (
                <span className={styles['matchItem-result']}>Win</span>
            ) : (
                <span className={styles['matchItem-result']}>Lose</span>
            )}
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