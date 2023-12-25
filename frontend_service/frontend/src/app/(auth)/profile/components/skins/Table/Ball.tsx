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

    const [ActiveSkin, setActiveSkin] = React.useState<string>("null");
    
    return (
        <div className={styles.Table}>
            <SkinComp svgImage={default_ball}  Name="Default" Type="ball" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={basketball}  Name="basketball" Type="ball" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={redball}  Name="redball" Type="ball" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={mikaza}  Name="mikaza" Type="ball" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
        </div>
    );
};

export default Ball