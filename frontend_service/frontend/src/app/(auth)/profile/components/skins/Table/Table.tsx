"use client"
import React from 'react';
import styles from './Table.module.css';
import SkinComp from '../SkinComp/SkinComp';
import kazino from './../../../imgs/kazino.svg';
import Beach from './../../../imgs/Beach.svg';
import default_table from './../../../imgs/default_table.svg';

const Table: React.FC = () => {

  const [ActiveSkin, setActiveSkin] = React.useState(false);
  return (
    <div className={styles.Table}>
      <SkinComp svgImage={default_table} Name="Default" Type="table" active={ActiveSkin === false} onClick={() => setActiveSkin(false)}/>
      <SkinComp svgImage={kazino} Name="Kazino" Type="table" active={ActiveSkin === false} onClick={() => setActiveSkin(false)}/>
      <SkinComp svgImage={Beach} Name="Beach" Type="table" active={ActiveSkin === false} onClick={() => setActiveSkin(false)}/>
    </div>
  );
};

export default Table;