"use client";

import React, { use, useEffect } from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import styles from "./StatisticsPie.module.css";
import { StatisticsPieInterface } from "../interfaces";

interface StatisticsPieProps {
  statistics: StatisticsPieInterface;
}

const StatisticsPie: React.FC<StatisticsPieProps> = (props: {
  statistics: any;
}) => {
  const statistics = props.statistics;
  const WinPercentage =
    statistics.total !== 0 ? (statistics.wins * 100) / statistics.total : 0;
  const LosePercentage =
    statistics.total !== 0 ? (statistics.losses * 100) / statistics.total : 0

  const option = {
    color: ["var(--blue 500)"],
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: 10,
      data: ["Failure", "Success"],
    },
    series: [
      {
        name: "Status",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        showSymbol: false,
        data: [
          {
            value: WinPercentage,
            name: "Success",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(154, 155, 211, 0)",
                },
                {
                  offset: 1,
                  color: "#9A9BD3",
                },
              ]),
            },
          },
          {
            value: LosePercentage,
            name: "Failure",
            itemStyle: { color: "black" },
          },
        ],
      },
    ],
  };
  return (
    <div className={styles["widgetContainer"]}>
      <ReactEcharts option={option} style={{ height: "100%", width: "100%" }} />
      {/* Other children, if applicable */}
    </div>
  );
};

export default StatisticsPie;
