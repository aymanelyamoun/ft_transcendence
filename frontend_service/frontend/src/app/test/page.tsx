"use client";
import { useEffect, useState } from 'react';
import { socket }   from '../../socket';

interface userdata  {userId: string; status:string}

export default function test () {
    
    const [data, setData] = useState<userdata | null>(null);

    useEffect(() => {

        console.log('in use effect')
        socket.connect();

        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('friendStatus', (data) => {
            setData(data);
            console.log("data1:",data);
        });

        return () => {
            console.log('disconnected');
            socket.off('friendStatus');
            socket.disconnect();
        }
    }, []);
    console.log('data2:', data);
    return (<div className=' text-white'>textures</div>)
}