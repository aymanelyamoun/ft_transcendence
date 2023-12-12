import React from 'react'
import TypeMsg from './TypeMsg'
import { useState, useEffect, useRef } from 'react';

  const ChatSection = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const handleSendMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
  return (
    <div className='chatSection flex-grow flex flex-col justify-between'>
      <div className='message flex flex-col overflow-y-auto overflow-x-hidden pr-12'>

        {messages.map((message, index) => (
          <div>
            {<li className='rcvMsg'> ok thank you !</li>}
            <li className='sendMsg' key={index}> {message} </li>

          </div>
            )).reverse()}
      </div>
        <TypeMsg sendMessage={handleSendMessage}/>
    </div>

  )
}
export default ChatSection