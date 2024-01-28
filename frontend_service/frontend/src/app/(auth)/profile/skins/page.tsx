"use client"

import React from "react";
import styles from './global.module.css'
import StatusBar from "../components/skins/StatusBar/StatusBar";
import Table from "../components/skins/Table/Table";
import Paddle from "../components/skins/Table/Paddle";
import Ball from "../components/skins/Table/Ball";
function App() {
    return (
    <>
        <div className={styles['skins']}>
        <div className={styles['skins-container']}>
        <div className={styles['skins-topBar']}>
        {/* <SearchBar /> */}
        <StatusBar Table={<Table />} Paddle={<Paddle />} Ball={<Ball />}/>
        {/* <div className={styles.wallet}> */}
            {/* <FaGoogleWallet /> */}
            {/* <span className={styles['wallet-value']}>215</span> */}
        {/* </div> */}
        </div>
    </div>
    </div>
    </>
    )
}

export default App;