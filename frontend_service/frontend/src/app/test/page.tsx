"use client";
import { useEffect } from 'react';
import { socket }   from '../../socket';

export default function test () {
    useEffect(() => {
        return () => {
            console.log('disconnected');
            socket.disconnect();
        }
    }, []);
    return (<div className=' text-white'>textures</div>)
}