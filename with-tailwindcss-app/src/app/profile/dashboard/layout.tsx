import type { Metadata } from 'next'
import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import './global.module.css'
import Sidebar from '../components/dashboard/sidebar/sidebar'
import Skins from '../components/dashboard/skins/skins'
import Friends from '../components/dashboard/friends/friends'
import aoumad from '../imgs/aoumad.jpeg'
import yamon from '../imgs/ael-yamo.jpeg'
import Achievement from '../components/dashboard/achievements/achievement'
import Statistics from '../components/dashboard/statistics/statistics'
// import Statistics from '../components/dashboard/Statistics/Statistics'
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const friendsList = [
    { id: "1", name: "Friend 1", picture: aoumad.src },
    { id: "2", name: "Friend 2", picture: aoumad.src },
    { id: "3", name: "Friend 3", picture: aoumad.src },
    { id: "4", name: "Friend 4", picture: aoumad.src },
    { id: "5", name: "Friend 5", picture: aoumad.src },
    { id: "6", name: "Friend 6", picture: aoumad.src },
    { id: "7", name: "Friend 7", picture: aoumad.src },
    { id: "8", name: "Friend 8", picture: aoumad.src },
  ];


const FriendRequests = [
    { id: "1", name: "Friend 1", picture: yamon.src },
    { id: "2", name: "Friend 2", picture: yamon.src },
    { id: "3", name: "Friend 3", picture: yamon.src },
    { id: "4", name: "Friend 4", picture: yamon.src },
    { id: "5", name: "Friend 5", picture: yamon.src },
    { id: "6", name: "Friend 6", picture: yamon.src },
    { id: "7", name: "Friend 7", picture: yamon.src },
    { id: "8", name: "Friend 8", picture: yamon.src },
  ];

  return (
    <>
    <div className="App">
      <div className="AppGlass">
          <Sidebar/>
          <Skins/>
          <Achievement />
          <Statistics />
          <Friends friends={friendsList} friendsReq={FriendRequests} onFriendItemClick={function (id: string): void {
            throw new Error('Function not implemented.')
          } }/>
      </div>
    </div>
        {children}
    </>
  )
}