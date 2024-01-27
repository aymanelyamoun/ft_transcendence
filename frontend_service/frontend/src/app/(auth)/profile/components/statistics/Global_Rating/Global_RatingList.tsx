"use client"
import React from 'react'
import styles from './Global_Rating.module.css'
import RatingItem from './RatingItem';
// import { rating } from 'assert';

interface Rating {
    id: string;
    profilePic: string;
    username: string;
    title: string;
    totalXp: number;
}

interface RatingListProps {
    ratings: Rating[];
}

const Global_RatingList: React.FC<RatingListProps> = ({ ratings }) => {
  return (
    <div className={styles['RatingList']}>
        <ul>
            {ratings.map((rating: Rating) => (
            <RatingItem
                key={rating.id}
                id={rating.id}
                profilePic={rating.profilePic}
                username={rating.username}
                title={rating.title}
                totalXp={rating.totalXp}
            />
            ))}
        </ul>
    </div>
  )
}

export default Global_RatingList;