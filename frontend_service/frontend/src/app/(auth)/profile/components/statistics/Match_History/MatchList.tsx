"use client"
import React, { useEffect } from 'react'
import styles from './Match_History.module.css'
import { match } from 'assert';
import MatchItem from './MatchItem';
import {MatchProps} from './match_history_interfaces'
import styled from 'styled-components';
import { GiAstronautHelmet } from 'react-icons/gi';

// interface Match {
//   xp: number;
//   scoredGoals: number;
//   concededGoals: number;
// }

const NoGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15vh;
  color: #fff;
`;

const NoGroupIcon = styled.div`
  font-size: 11vh;
  color: #fff;
`;

const NoGroupSpan = styled.span`
font-size: 3vh;
`;

const MatchList: React.FC<MatchProps> = (props) => {

    const matches = props.matches;
    const UserProfileStyling = props.UserProfileStyling;
    return (
      <div className={styles['match-list']}>
        <ul className='flex flex-col-reverse'>
          {matches  && matches.length ? (
            matches.map((match, index: number) => (
              <MatchItem
                key={index}
                xp={match.xp}
                scoredGoals={match.scoredGoals}
                concededGoals={match.concededGoals}
                opponnetProfilePic={match.oponent.profilePic}
                userProfilePic={match.user.profilePic}
                UserProfileStyling={UserProfileStyling}
              />
            ))
          ) : 
          <NoGroupsContainer>
          <NoGroupIcon>
            <GiAstronautHelmet />
          </NoGroupIcon>
          <NoGroupSpan>No Available Matches</NoGroupSpan>
        </NoGroupsContainer>
          }
        </ul>
      </div>
    );
  };

export default MatchList;