"use client"

import React, { useEffect, useRef, useState } from "react";
import styles from './global.module.css'
import StatusBar from "../components/skins/StatusBar/StatusBar";
import Table from "../components/skins/Table/Table";
import Paddle from "../components/skins/Table/Paddle";
import Ball from "../components/skins/Table/Ball";
import { socket } from '@/socket';
import { AlertMessage } from '../../chat/components/alertMessage';
import { useRouter } from "next/navigation";
interface User {
    id: string;
    email: string;
    username: string;
    profilePic?: string;
    hash: string;
    typeLog: string;
    isTwoFactorEnabled: Boolean;
  } // use the exported interface instead
  
function App() {
    const router = useRouter();
    const [playPopUp, setplayPopUp] = useState<boolean>(false);
    const popUpTimeout = useRef<NodeJS.Timeout>(null!);
    const inviterData = useRef<User>(null!)
    useEffect(() => {
        socket.connect()
        socket.on('redirect', (destination : string) => {
          router.push(destination)
        })
        socket.on('gameInvite', (data : any) => {
          inviterData.current = data;
          setplayPopUp(true);
          popUpTimeout.current = setTimeout(() => {
            setplayPopUp(false);
          }, 10000);
        })
        return () => {
            socket.disconnect();
            socket.off('redirect')
            socket.off('gameInvite');
          }
      }, [router])
    
    return (
    <>
        {playPopUp && (<AlertMessage onClick={() => setplayPopUp(false)}
            message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`}
            type="wannaPlay" id={`${inviterData.current.id}`}/>)}
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