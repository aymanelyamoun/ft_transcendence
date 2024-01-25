import React, { useEffect } from 'react'
import Image from 'next/image'
import playFriend from '../../../../../public/playButton.png';

const Play = () => {
    
  
  return (
    <div className='playContainer cursor-pointer'>
      
        <Image className='playIcon' src={playFriend} alt='play'/>
    </div>
  )
}

export default Play