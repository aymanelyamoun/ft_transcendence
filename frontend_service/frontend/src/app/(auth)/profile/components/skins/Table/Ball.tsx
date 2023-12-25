"use client"
import React from 'react';
import styles from './Table.module.css';
import SkinComp from '../SkinComp/SkinComp';
import styled from 'styled-components';
import default_ball from './../../../imgs/default_ball.svg';
import basketball from './../../../imgs/basketball.svg';
import redball from './../../../imgs/redball.svg';
import mikaza from './../../../imgs/mikaza.svg';

const Ball: React.FC = () => {
    return (
        <div className={styles.Table}>
            <SkinComp svgImage={default_ball}  Name="Default" Type="table" />
            <SkinComp svgImage={basketball}  Name="basketball" Type="table" />
            <SkinComp svgImage={redball}  Name="redball" Type="table" />
            <SkinComp svgImage={mikaza}  Name="mikaza" Type="table" />
        </div>
    );
};

export default Ball