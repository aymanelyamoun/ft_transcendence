"use client";

import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import styles from './StatisticsChart.module.css';
import { StatisticsPieInterface, StatisticsChartInterface } from  "../../../components/dashboard/interfaces";

interface StatisticsChartProps {
  statistics: StatisticsChartInterface;
};
interface DayData {
    day: string;
    gamesPlayed: number;
  }

  
  const StatisticsChart: React.FC<StatisticsChartProps> = (props: { statistics: any; }) => {
      const daysOfWeek  = props.statistics;

      useEffect(() => {
        console.log("Chart stati: ", props.statistics);
      }, []);
   
    const option = {
      color: ['var(--blue 500)'],
  
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
  
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        backgroundColor: 'rgba(0, 0, 0, 0.59)',
        borderWidth: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        show: false,
      },
  
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: daysOfWeek.map((dayData : DayData) => dayData.day),
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          type: 'line',
          smooth: true,
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(154, 155, 211, 0)',
              },
              {
                offset: 1,
                color: '#9A9BD3',
              },
            ]),
            width: 4,
          },
          areaStyle: {
            opacity: 0.5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [
              {
                offset: 0,
                color: '#9A9BD3',
              },
              {
                offset: 1,
                color: 'rgba(154, 155, 211, 0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          showSymbol: false,
          data: daysOfWeek.map((dayData : DayData) => dayData.gamesPlayed),
        },
      ],
    };

  return (
    <div className={styles['widgetContainer']}>
      <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
      {/* Other children, if applicable */}
    </div>
  );
};

export default StatisticsChart;