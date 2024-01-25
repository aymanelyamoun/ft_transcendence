"use client"
import React from 'react'
import styles from './Global_Rating.module.css'
import Global_RatingList from './Global_RatingList';
import { GiSettingsKnobs } from "react-icons/gi";
import { Rating } from "../interfaces";
interface RatingListProps {
    ratings: Rating[];
}

const Global_Rating: React.FC<RatingListProps> = ({ratings}) => {
  return (
    <div className={styles['global-rating']}>
        <div className={styles['global-rating-title']}>
            <span>Global Rating</span>
            {/* <GiSettingsKnobs className={styles['global-rating-icon']}/> */}
        </div>
        <Global_RatingList ratings={ratings} />
    </div>
  )
}

export default Global_Rating;