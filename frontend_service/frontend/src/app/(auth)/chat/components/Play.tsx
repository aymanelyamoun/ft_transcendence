import React from 'react'
import Image from 'next/image'
import addFriend from '../../../../../public/playButton.png';
// import addFriend from '../../../../public/playButton.png';

const Play = () => {
  return (
    <div className='playContainer cursor-pointer'>
        <Image className='playIcon' src={addFriend} alt='play'/>
    </div>
  )
}

export default Play