// "use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import avatar from '../../../../../public/garou-kid.jpeg';
// import avatar from '../../../../public/garou-kid.jpeg';
import FriendList from './FriendList';
import AddFriend from './AddFriend';
import AddToChannel from './AddToChannel';
import Play from './Play';

const ProfileInfos = () => {

  return (
    <div className='profileInfo basis-1/4 bg-purple-600'>
      
      <div>
        <Image className='avatar' src={avatar} alt={"avatar"}/>
        <div className='nameAndTitle'>
          <h1 className='nameInfo'> username </h1>
          <h2 className='titleInfo' > title </h2>
        </div>
      </div>
      <div className='flex gap-3 justify-center flex-wrap pr-10 pl-10'>
        <AddFriend/>
        <AddToChannel/>
        <Play/>
      </div>
    </div>
  )
}

export default ProfileInfos