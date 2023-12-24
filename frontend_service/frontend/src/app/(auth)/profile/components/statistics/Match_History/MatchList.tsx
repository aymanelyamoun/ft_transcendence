"use client"
import React, { useEffect } from 'react'
import styles from './Match_History.module.css'
import { match } from 'assert';
import MatchItem from './MatchItem';
import {MatchProps} from './match_history_interfaces'

// interface Match {
//   xp: number;
//   scoredGoals: number;
//   concededGoals: number;
// }


const MatchList: React.FC<MatchProps> = (props) => {

  const matches = props.matches;
  const UserProfileStyling = props.UserProfileStyling;
  useEffect(() => {
    console.log('after fetcddddh');
    console.log(matches);
    console.log('----------');
    // if (Array.isArray(matches))
    //   console.log("here is an array");
  }, []);
  return (
    <div className={styles['match-list']}>
      <ul>
      { matches.map((match, index: number) => (
        <MatchItem
          key={index}
          xp={match.xp}
          scoredGoals={match.scoredGoals}
          concededGoals={match.concededGoals}
          UserProfileStyling={UserProfileStyling}
        />
      ))}
      </ul>
    </div>
  );
};

export default MatchList;