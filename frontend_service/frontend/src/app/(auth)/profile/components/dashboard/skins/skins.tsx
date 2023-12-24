"use client"
import React from 'react';
import styles from "./skins.module.css";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Skins: React.FC = () => {
  return (
    <div className={styles.Skins}>
      <div className={styles['skins-container']}>
        <span className={styles['skins-title']}>Skins</span>
        <div className={styles['Skins-rectangle']}>
          <div className={styles['Skins-circle']}></div>
        </div>
        <div className={styles['Skins-stick']}></div>
      </div>
    </div>
  );
};

export default Skins;