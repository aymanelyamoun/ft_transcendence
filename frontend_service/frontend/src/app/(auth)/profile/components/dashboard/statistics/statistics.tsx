"use client"
import React, { useEffect } from 'react';
import StatisticsChart from '../StatisticsChart/StatisticsChart';
import StatisticsPie from '../StatisticsPie/StatisticsPie';
import styles from "./statistics.module.css";
import { StatisticsInterface } from '../interfaces';

interface StatisticsProps {
  statistics: StatisticsInterface;
}

const Statistics: React.FC<StatisticsProps> = (props) => {
  const statistics = props.statistics;
  return (
    <div className={styles.statistics}>
      <div className={styles.container}>
          <StatisticsChart statistics={statistics}/>
            <StatisticsPie statistics={statistics}/>
      </div>
    </div>
  );
};

export default Statistics;