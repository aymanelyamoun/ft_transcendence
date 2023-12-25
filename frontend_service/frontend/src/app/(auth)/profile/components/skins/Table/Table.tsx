"use client"
import React from 'react';
import styles from './Table.module.css';
import SkinComp from '../SkinComp/SkinComp';
import kazino from './../../../imgs/kazino.svg';
import Beach from './../../../imgs/Beach.svg';
import default_table from './../../../imgs/default_table.svg';

const Table: React.FC = () => {

  const [ActiveSkin, setActiveSkin] = React.useState<string>("null");
  return (
    <div className={styles.Table}>
      <SkinComp svgImage={default_table} Name="default" Type="table" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
      <SkinComp svgImage={kazino} Name="kazino" Type="table" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
      <SkinComp svgImage={Beach} Name="beach" Type="table" active={ActiveSkin} setActiveSkin={setActiveSkin}/>
    </div>
  );
};

export default Table;