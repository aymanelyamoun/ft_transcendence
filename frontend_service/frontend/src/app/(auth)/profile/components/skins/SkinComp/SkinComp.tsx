"use client";
import React from 'react';
import styles from './SkinComp.module.css';

interface SkinProps {
  svgImage: any;
  skinName: string;
}

const SkinComp: React.FC<SkinProps> = ({ svgImage, skinName }) => {
  return (
    <div className={styles.SkinComp}>
        <img src={svgImage.src} alt={skinName} />
        <span className={styles['skin-name']}>{skinName}</span>
    </div>
  );
};

export default SkinComp;