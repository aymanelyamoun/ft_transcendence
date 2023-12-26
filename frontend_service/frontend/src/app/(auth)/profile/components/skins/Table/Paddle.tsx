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

    return (
        <div className={styles.Table}>
            <SkinComp svgImage={default_paddle}  Name="Default" Type="paddle"/>
            <SkinComp svgImage={bong}  Name="bong" Type="paddle"/>
            <SkinComp svgImage={greeny}  Name="greeny" Type="paddle"/>
            <SkinComp svgImage={potto}  Name="potto" Type="paddle"/>
        </div>
    );
};

export default Paddle;