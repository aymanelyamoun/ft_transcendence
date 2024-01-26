"use client";
import React, { useEffect } from "react";
import StatisticsChart from "../../dashboard/StatisticsChart/StatisticsChart";
import StatisticsPie from "../../dashboard/StatisticsPie/StatisticsPie";
import styles from "./Statistics.module.css";
import {
  StatisticsPieInterface,
  StatisticsChartInterface,
} from "../../dashboard/interfaces";

interface StatisticsProps {
  StatisticsPie: StatisticsPieInterface;
  StatisticsChart: StatisticsChartInterface;
}

const Statistics: React.FC<StatisticsProps> = (props) => {
  const statistics = props;

  // useEffect(() =>
  // {
  //   console.log("Pie stati: ",props.StatisticsPie);
  //   console.log("Chart stati: ", props.StatisticsChart);
  // });

  return (
    <div className={styles.statistics}>
      <div className={styles.container}>
        <StatisticsPie statistics={statistics.StatisticsPie} />
        <StatisticsChart statistics={statistics.StatisticsChart} />
      </div>
    </div>
  );
};

export default Statistics;
