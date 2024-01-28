"use client"

import React from 'react';import type { Metadata } from 'next'
import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import styles from './global.module.css';
import Statistics from '../components/statistics/Statistics/Statistics'
import Match_History from '../components/statistics/Match_History/Match_History';
import aoumad from '../imgs/aoumad.jpeg'
import yamon from '../imgs/ael-yamo.jpeg'
import snouae from '../imgs/snouae.jpeg'
import Global_Rating from '../components/statistics/Global_Rating/Global_Rating';
import { StatisticsPieInterface, StatisticsChartInterface } from '../components/dashboard/interfaces';
 
import { useRouter } from "next/navigation";
import { useUser } from '../../layout';
import { Rating } from "./../components/statistics/interfaces";

function App() {
    const [SidebarDone,setSidebarDone] = useState<boolean>(false);
    const [PieDone, setPieDone] = useState<boolean>(false);
    const [ChartDone, setChartDone] = useState<boolean>(false);
    const [globalRatingDone, setGlobalRatingDone] = useState<boolean>(false);
    const [statisticsPieProps, setStatisticsPieProps] = useState<StatisticsPieInterface>({
      wins: 0,
      losses: 0,
      total: 0,
    });
    const [statisticsChartProps, setStatisticsChartProps] = useState<StatisticsChartInterface>({
      daysOfWeek: [],
    });

    const [SidebarInfo, setSidebarInfo] = useState({
      id: "",
      username: "",
      title: "",
      profilePic: "",
      wallet: 0,
    });

    // const [globalRating, setGlobalRating] = useState({
    //   id: "",
    //   profilePic: "",
    //   username: "",
    //   title: "",
    //   totalXp: 0,
    // })[]

    const [globalRating, setGlobalRating] = useState<Rating[]>([]);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [IsMatchLoading, setIsMatchLoading] = useState<boolean>(false);
    const [matchHistory, setMatchHistory] = useState({
          id: "",
          username: "",
          title: "",
          profilePic: "",
          wallet: 0,
          gameRecords : []
      });

    const router = useRouter();
    const [username, setUsername] = useState<string | undefined>();
    const user = useUser();
    useEffect(() => {
      const checkAuthentication = async () => {
          if (user) {
            setUsername(user.username);
          }
      };
      checkAuthentication();
    }, [user, router]); 

    
    useEffect(() => {
      const fetchGlobalRating = async () =>
      {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"user/globalRating", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (res.ok)
          {
            const data = await res.json();
            setGlobalRating(data);
          }
          else
          {
            console.log("Global rating isn't okay");
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally
        {
          setGlobalRatingDone(true);
        }
    };

      const fetchMatchHistory = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/profil/${username}`, {
              method: "GET",
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
            if (res.ok) { 
              const parseData = await res.json();
              setMatchHistory(parseData);
              setIsMatchLoading(false);
            } else {
              alert("Match History fetching isn't okay"); 
            }
            } catch (err) {
              console.log(err);
            } finally {
              setIsMatchLoading(true);
            }
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"user/profile", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSidebarInfo(data);
          setSidebarDone(true);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally
      {
        setSidebarDone(true);
      }
    };

      if (username)
        fetchMatchHistory();
        fetchGlobalRating();
        fetchUserData();
    }, [SidebarDone, globalRatingDone, IsLoading, IsMatchLoading, username]);

    useEffect(() => 
    {
      const fetchStatisticsPie = async () => 
      {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/winsLoses/${username}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
          const data = await res.json();
          setStatisticsPieProps(data);
          setPieDone(false);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally
        {
          setPieDone(true);
        }
      };
  
      const fetchStatisticsChart = async () => 
      {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/games/week/${username}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (res.ok)
          {
            const data = await res.json();
            setStatisticsChartProps(data);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally
        {
          setChartDone(true);
        }
      };
  
      if (username)
      {
        fetchStatisticsPie();
        fetchStatisticsChart();
      }
    }, [PieDone, ChartDone, username]);
  
  return (
      <>
            <div className={styles['statistics']}>
              <div className={styles['left-panel']}>
                {PieDone && ChartDone &&
                 <Statistics StatisticsPie={statisticsPieProps} StatisticsChart={statisticsChartProps}/>
                }
                {IsMatchLoading && 
                <Match_History matches={matchHistory.gameRecords} UserProfileStyling={false}/>
                }
              </div>
              <div className={styles['right-panel']}>
                {globalRatingDone  &&
                <Global_Rating ratings={globalRating}/>
                }
              </div>
            </div>
        </>
    )
}

export default App;