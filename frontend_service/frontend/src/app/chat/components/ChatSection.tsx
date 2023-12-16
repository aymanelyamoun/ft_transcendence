import React, { createContext, useContext } from "react";
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

export const ConversationMessagesContextSet = createContext(
  {} as React.Dispatch<React.SetStateAction<MessageProps[]>>
);
export const ConversationMessagesContextStat = createContext(
  {} as MessageProps[]
);

export const ConversationChatSection = () => {
  const messagesData = useContext(MessagesContext);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const conversation = useContext(LstConversationStateContext);

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);

  console.log("messages:", messages);
  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      <div className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12">
        {messages.map((message) => {
          // if (message.senderId === userId) {
            return <Message message={message} />;
          // }
        }).reverse()}
      </div>
      <ConversationMessagesContextSet.Provider value={setMessages}>
        <ConversationMessagesContextStat.Provider value={messages}>
          <TypeMessage />
          {/* <TypeMsg
            userId={userId}
            conversationId={conversation?.id}
            // sendMessage={handleSendMessage}
            messages={messages}
            setMessages={setMessages}
          /> */}
        </ConversationMessagesContextStat.Provider>
      </ConversationMessagesContextSet.Provider>
    </div>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  if (message.senderId === userId) {
    return <MessageChat message={message} type="sendMsg" />;
  }
  return <MessageChat message={message} type="rcvMsg" />;
};

const MessageChat = ({ message, type }: { message: MessageProps, type:string }) => {
  return <div className={type}>
        {/* <div className=""> */}
          <Image
            className="rounded-full float-left mr-[10px] mt-[4px] border-[1.5px] border-[#202345]"
            src={avatar}
            alt="profile pic"
            width={43}
            height={43}
          />
          <p className="ml-2 mt-2 mb-2"> {message.message} </p>
        {/* </div> */}
      </div>
}
const TypeMessage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const setMessages = useContext(ConversationMessagesContextSet);
  const messages = useContext(ConversationMessagesContextStat);
  const conversation = useContext(LstConversationStateContext);

  const newMessage: MessageProps = {
    id: "1",
    message: inputValue,
    senderId: userId,
    conversationId: conversation?.id ?? "", // Provide a default value for conversationId
    createdAt: new Date(),
    sender: { profilePic: conversation?.profilePic ?? "" },
  };

  const sendMessage = () => {
    newMessage.message = inputValue;
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
  };

  const handlePressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      console.log("inputValue:", inputValue);
      sendMessage();
      setInputValue("");
    }
  };

  return (
    <div onKeyDown={handlePressKey} className="TypeMsgcontainer flex">
      <input
        value={inputValue}
        type="text"
        onChange={(e) => setInputValue(e.target.value)}
        onSubmit={sendMessage}
        placeholder="Type Something ..."
        className="typeMsg"
      />
    </div>
  );
};

export default ChatSection;
