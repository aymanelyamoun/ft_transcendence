"use client"
import React, { useEffect } from 'react';
import StatisticsChart from '../../dashboard/StatisticsChart/StatisticsChart';
import StatisticsPie from '../../dashboard/StatisticsPie/StatisticsPie';
import styles from './Statistics.module.css';
import { StatisticsPieInterface, StatisticsChartInterface } from  "../../../components/dashboard/interfaces";
import styled from 'styled-components';


interface StatisticsProps {
  StatisticsPie : StatisticsPieInterface;
  StatisticsChart : StatisticsChartInterface;
  UserProfile: boolean;
}

const StatisticsUserProfile = styled.div`
grid-row-start: 2;
grid-column-start: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  /* top: 2.5vh; */
  /* padding-bottom: 2rem; */
  transition: all 300ms ease;
  flex-wrap: nowrap;
`;

const StatisticsStandard = styled.div`
  grid-row-start: 3;
  grid-row-end: 4;
  grid-column-start: 3;
  grid-column-end: 5;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  /* top: 2.5vh; */
  /* padding-bottom: 2rem; */
  transition: all 300ms ease;
  flex-wrap: nowrap;

  @media (max-width: 1000px) {
    grid-row-start: 3;
    /* grid-row-end: 5; */
    grid-column-start: 1;
    grid-column-end: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    /* top: 1.5vh; */
    /* padding-bottom: 2rem; */
    transition: all 300ms ease;
  }

  @media (max-width: 550px)
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 27.5rem;
    width: 79%;
    height: 30%;
    transition: all 300ms ease;
  }
`;

const Statistics: React.FC<StatisticsProps> = (props) => {
  const statistics = props;
  const UserProfile = props.UserProfile;
  // useEffect(() => 
  // {
  //   console.log("Pie stati: ",props.StatisticsPie);
  //   console.log("Chart stati: ", props.StatisticsChart);
  // });

  const StatisticsRoot = UserProfile ? StatisticsUserProfile : StatisticsStandard;
  return (
    <StatisticsRoot>
      <div className={styles.container}>
      <StatisticsPie statistics={statistics.StatisticsPie}/>
      <StatisticsChart statistics={statistics.StatisticsChart}/>
      </div>
    </StatisticsRoot>
  );
};

export default Statistics;