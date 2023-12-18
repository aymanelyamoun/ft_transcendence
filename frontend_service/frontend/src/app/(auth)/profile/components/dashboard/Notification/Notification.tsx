"use client";

import React from 'react'
import styles from './Notification.module.css'
import NotifIcon from './notif_icon';

  interface NotificationProps {
    onRequestClick: () => void;
  }
  
  const Notification: React.FC<NotificationProps> = ({ onRequestClick }) => {
    const [notif, setNotif] = React.useState('');
    const [showFriends, setShowFriends] = React.useState(false);

    const handleNotifChange = () => {
        onRequestClick();
    };

    const handleNotifIconClick = () => {
        setShowFriends((prevShowFriends) => !prevShowFriends);
    };

    return (
        <div className={styles.notification}>
        <NotifIcon onClick={handleNotifChange}  />
        </div>
    );
};

export default Notification;