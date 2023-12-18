import React, { createContext, useContext } from "react";
import TypeMsg from "./TypeMsg";
import { useState, useEffect, useRef } from "react";
import {
  LstConversationStateContext,
  MessagesContext,
} from "./ConversationInfo";
// import { v4 as uuidv4 } from "uuid";
import { MessageProps } from "../../../../../../backend_service/backend/types/chatTypes";
import avatar from "../../../../public/garou-kid.jpeg";
import jake from "../../../../public/jakeWithHeadPhones.jpg";
import Image from "next/image";
import { socket } from "../../../socket";

import { userId, isAdmin } from "./ConversationInfo";

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
  const [data, setData] = useState<string>("");

  const newMessage: MessageProps = {
    // id: uuidv4(),
    id: "1",
    message: "",
    senderId: userId,
    conversationId: conversation?.id ?? "", // Provide a default value for conversationId
    createdAt: new Date(),
    sender: { profilePic: conversation?.profilePic ?? "" },
  };

  useEffect(() => {
    // new
    // set uuid
    newMessage.id = "5";
    console.log("chat sockets");
    socket.connect();

    socket.on("connect", () => {
      socket.emit("userData", { userId: userId, isAdmin: "false" });
      console.log("connected to server");
    });

    socket.on("rcvMessage", (data) => {
      setData(data);
      console.log("data:", data);
      newMessage.message = data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    setMessages(messagesData);
    return () => {
      socket.off("rcvMessage");
      socket.disconnect();
    };
  }, [data, messagesData]);

  console.log("data:", data);
  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      <div className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12">
        {messages
          .map((message) => {
            // if (message.senderId === userId) {
            return <Message key={message.id} message={message} />;
            // }
          })
          .reverse()}
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

const MessageChat = ({
  message,
  type,
}: {
  message: MessageProps;
  type: string;
}) => {
  return (
    <div className={type}>
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
  );
};
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
    socket.emit("messageTo", {from: userId, conversationId: conversation?.id, message: inputValue});
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
