import React from 'react';
import StatisticsChart from '../StatisticsChart/StatisticsChart';
import StatisticsPie from '../StatisticsPie/StatisticsPie';
import styles from "/home/snouae/Desktop/ft_transcendence/with-tailwindcss-app/src/app/profile/components/dashboard/statistics/statistics.module.css";

interface StatisticsProps {}

const Statistics: React.FC<StatisticsProps> = () => {
  return (
    <div className={styles.statistics}>
      <div className={styles.container}>
          <StatisticsChart />
            <StatisticsPie />
      </div>
    </div>
  );
};

export default Statistics;