"use client"
import React from 'react'
import styles from './Global_Rating.module.css'
import Link from 'next/link';

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

const RatingItem: React.FC<Rating> = ({id, profilePic, username, title, totalXp}) => {
    return (
        <div className={styles['rating-container']}>
            <Link href={`/profile/FriendProfile?username=${username}`}>
                <div className={styles['player-profile']}>
                    <img src={profilePic} alt="Profile" className={styles['rounded-lg']} />
                </div>
            </Link>
                <div className={styles['username-container']}>
                    <span className={styles['player-name']}>{username}</span>
                    <span className={styles['player-title']}>{title}</span>
                </div>
            <span className={styles['player-rating']}>{totalXp}</span>
        </div>
      )
}

export default RatingItem;