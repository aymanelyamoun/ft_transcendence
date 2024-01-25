import React from 'react'
import Image from 'next/image'
import addToChannel from '../../../../../public/addToChannelButton.png';


const AddToChannel = () => {
  return (
    <div className='addTochannelContainer cursor-pointer'>
        <Image className='addToChannelIcon' src={addToChannel} alt='addToChannel' width={30} height={30}/>
    </div>
  )
}

export default AddToChannel