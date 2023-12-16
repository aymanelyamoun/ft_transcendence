import React, { useContext } from "react";
import TypeMsg from "./TypeMsg";
import { useState, useEffect, useRef } from "react";
import {
  LstConversationStateContext,
  MessagesContext,
} from "./ConversationInfo";
import { MessageProps } from "../../../../../../backend_service/backend/types/chatTypes";
import avatar from "../../../../public/garou-kid.jpeg";
import jake from "../../../../public/jakeWithHeadPhones.jpg";
import Image from "next/image";

import { userId, isAdmin } from "./ConversationInfo";

const ChatSection = () => {
  const messagesData = useContext(MessagesContext);
  const conversation = useContext(LstConversationStateContext);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  // const handleSendMessage = (message: MessageProps) => {
  //   setMessages((prevMessages) => [...prevMessages, message]);
  // };

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);

  console.log("messages:", messages);
  console.log("messagesData:", messagesData);
  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      <div className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12">
        {messages
          .map((message, index) => (
            <div>
              {<li className="rcvMsg"> ok thank you !</li>}
              <li className="sendMsg" key={index}>
                {" "}
                {message.message}{" "}
              </li>
            </div>
          ))
          .reverse()}
      </div>
      <TypeMsg
        userId={userId}
        conversationId={conversation?.id}
        // sendMessage={handleSendMessage}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export const ConversationChatSection = () => {
  const messagesData = useContext(MessagesContext);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const conversation = useContext(LstConversationStateContext);

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);

  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      <div className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12">
        {messages.map((message) => {
          if (message.userId === userId) {
            return <Message message={message} />;
          }
        })}
      </div>
        <TypeMsg
          userId={userId}
          conversationId={conversation?.id}
          // sendMessage={handleSendMessage}
          messages={messages}
          setMessages={setMessages}
        />
    </div>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <>
      <div className="sendMsg">
        <div className=""> 
          <Image className="rounded-full float-left mr-[10px] mt-[4px] border-[1.5px] border-[#202345]" src={avatar} alt="profile pic" width={43} height={43} />
          <p className="ml-2 mt-3 "> {message.message} </p>
        </div>
      </div>

      <div className="rcvMsg">
        <div className=""> 
          <Image className="rounded-full float-left mr-[10px] mt-[4px] border-[1.5px] border-[#202345]" src={jake} alt="profile pic" width={43} height={43} />
          <p className="ml-2 mt-3 "> {message.message} </p>
        </div>
      </div>
    </>
  );
};

export default ChatSection;
