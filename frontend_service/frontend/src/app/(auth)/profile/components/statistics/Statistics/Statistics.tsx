"use client"
import React from 'react';
import StatisticsChart from '../../dashboard/StatisticsChart/StatisticsChart';
import StatisticsPie from '../../dashboard/StatisticsPie/StatisticsPie';
import styles from './Statistics.module.css';


interface StatisticsInterface
{
  wins: number;
  losses: number;
  total: number;
}

interface StatisticsProps {
  statistics: StatisticsInterface;
}

const Statistics: React.FC<StatisticsProps> = (props) => {
  const statistics = props.statistics;

  return (
    <div className={styles.statistics}>
      <div className={styles.container}>
      <StatisticsPie statistics={statistics}/>
          <StatisticsChart statistics={statistics}/>
      </div>
    </div>
  );
};

export default Statistics;