"use client"
import React from 'react';
import styles from './Table.module.css';
import SkinComp from '../SkinComp/SkinComp';
import styled from 'styled-components';
import default_paddle from './../../../imgs/default_paddle.svg';
import bong from './../../../imgs/bong.svg';
import greeny from './../../../imgs/greeny.svg';
import potto from './../../../imgs/potto.svg';

const Paddle: React.FC = () => {

    const [ActiveSkin, setActiveSkin] = React.useState<string>("null");

    return (
        <div className={styles.Table}>
            <SkinComp svgImage={default_paddle}  Name="default" Type="paddle" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={bong}  Name="bong" Type="paddle" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={greeny}  Name="greeny" Type="paddle" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
            <SkinComp svgImage={potto}  Name="potto" Type="paddle" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
        </div>
    );
};

export default Paddle;