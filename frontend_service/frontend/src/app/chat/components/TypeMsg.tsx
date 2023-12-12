import React from 'react'
import Image from 'next/image'
// import sendIcon from '../../../../public/sendButton.png';
import sendIcon from '../../../../public/sendButton.png';
import { KeyboardEvent } from 'react';
import { useState } from 'react';

interface TypeMsgProps {
    sendMessage: (message: string) => void;
}

const TypeMsg = ({sendMessage} : TypeMsgProps)  => {

    const [inputValue, setInputValue] = useState<string>('');

    const handleSendMsg = () => {
        if (inputValue.trim() !== '') 
        {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleClick = () => {
        handleSendMsg();
        setInputValue('');
    }
    
    const handlePressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleSendMsg();
            setInputValue('');
        }
    }

  return (
    <div onKeyDown={handlePressKey} className='TypeMsgcontainer flex'>
            <input value={inputValue} type="text" onChange={handleInputChange} placeholder='Type Something ...' className='typeMsg'/>
            <Image  onClick={handleClick}  className='sendIcon' src={sendIcon} alt='sendIcone'/>
    </div>
  )
}

export default TypeMsg