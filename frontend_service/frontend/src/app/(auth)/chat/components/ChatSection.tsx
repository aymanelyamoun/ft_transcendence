import React, { createContext, useContext } from "react";
import { useState, useEffect, useRef } from "react";
import {
  ConversationListContextSet,
  LstConversationStateContext,
  MessagesContext,
  blockedUsersContext,
  refreshContext,
  setBlockedUsersContext,
} from "./conversationInfo";
// import { v4 as uuidv4 } from "uuid";
import { ConversationIthemProps, MessageProps } from "@/utils/types/chatTypes";
import avatar from "../../../../../public/garou-kid.jpeg";
import Image from "next/image";
import { socket } from "../../../../socket";

import sendIcon from "../../../../../public/sendButton.png";
// import { isAdmin } from "./ConversationInfo";
import { SiWechat } from "react-icons/si";
import { UserContext } from "@/utils/createContext";
// import { Link } from "react-router-dom";

export const ConversationMessagesContextSet = createContext(
  {} as React.Dispatch<React.SetStateAction<MessageProps[]>>
);
export const ConversationMessagesContextStat = createContext(
  {} as MessageProps[]
);
import Link from 'next/link';

// export interface BlockedUser{
//   id: string;
// }[]

function createConversationListIthem(
  Message: MessageProps
): ConversationIthemProps {
  if (Message.conversation.type === "DIRECT") {
    return {
      id: Message.conversationId,
      name: Message.sender.username,
      profilePic: Message.sender.profilePic,
      // profilePic: cur.profilePic,
      lastMessage: Message.message,
      type: Message.conversation.type, // replace with actual type
      createdAt: new Date(), // replace with actual creation date
      updatedAt: new Date(), // replace with actual creation date
      channelId: "someChannelId", // replace with actual channel ID
      title: "someTitle", // replace with actual title
    };
  }
  return {
    id: Message.conversationId,
    name: Message.conversation.channel.channelName,
    // profilePic: Message.sender.profilePic,
    profilePic: Message.conversation.channel.channelPic,
    lastMessage: Message.message,
    type: Message.conversation.type, // replace with actual type
    createdAt: new Date(), // replace with actual creation date
    updatedAt: new Date(), // replace with actual creation date
    channelId: Message.conversation.channel.id, // replace with actual channel ID
    title: "someTitle", // replace with actual title
  };
}

export const ConversationChatSection = ({
  setRefresh,
  refresh,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}) => {
  const messagesData = useContext(MessagesContext);
  const setConversationList = useContext(ConversationListContextSet);
  const lastConversation = useContext(LstConversationStateContext);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const userInfo = useContext(UserContext);
  // const chatContainerRef = useRef(null!);
  const chatContainerRef = useRef<HTMLDivElement>(null!);
  const blockedUsers = useContext(blockedUsersContext);
  const setBlockedUsers = useContext(setBlockedUsersContext);

  let maxId = 0;
  if (messages.length !== 0) {
    maxId = messages.reduce(
      (max, message) => Math.max(max, message.id),
      messages[0].id
    );
  }
  const conversation = useContext(LstConversationStateContext);
  // const [data, setData] = useState<string>("");

  // const refreshVar =  useContext(refreshContext);

  useEffect(() => {
    let newMessage: MessageProps;
    socket.connect();

    socket.on("connect", () => {
    });

    socket.on("rcvMessage", (data) => {
      newMessage = data;
      if (newMessage.conversationId === conversation?.id)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversationList((prevConversationList: any) => [
        createConversationListIthem(newMessage),
        ...prevConversationList.filter((conversation: any) => {
          return conversation.id !== newMessage.conversationId;
        }),
      ]);
    });
    setMessages(messagesData);
    return () => {
      socket.off("rcvMessage");
      socket.disconnect();
    };
  }, [
    messagesData,
    conversation?.id,
    setConversationList,
    refresh,
    setRefresh,
    conversation,
  ]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, refresh, setRefresh]);

  useEffect(() => {
    const fetchFun = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "channels/blockedUsers",
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setBlockedUsers(data);
          }
        });
    };
    fetchFun();
  }, [setBlockedUsers]);


  const convType = conversation?.type;
  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      {lastConversation !== undefined ? (
        <div
          ref={chatContainerRef}
          className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12"
        >
          
          {
            convType !== "DIRECT" ? (
              messages
                .filter((message) => message.message.trim() !== "")
                .filter((message) => {
                  if (blockedUsers.length === 0) return true;
                  return !blockedUsers.some(
                    (blockedUser) => blockedUser.id === message.senderId
                  );
                })
                .map((message) => {
                  return <Message key={message.id} message={message} />;
                  // }
                }))
                : (
                  messages
                    .filter((message) => message.message.trim() !== "")
                    .map((message) => {
                      return <Message key={message.id} message={message} />;
                    }))       
          }
        </div>
      ) : null}
      <ConversationMessagesContextSet.Provider value={setMessages}>
        <ConversationMessagesContextStat.Provider value={messages}>
          {lastConversation !== undefined && conversation?.type !== "D" ? (
            <TypeMessage maxId={maxId} setRefresh={setRefresh} />
          ) : conversation?.type === "D" || lastConversation === undefined ? (
            <div className="flex flex-col items-center h-full w-full">
              <SiWechat size={360} color="#FEFFFF" className=" opacity-40 " />
              <h1 className="font-poppins text-2xl text-[#FEFFFF] text-center">
                Welcome To The Chat Section
              </h1>
            </div>
          ) :
          null
          }
        </ConversationMessagesContextStat.Provider>
      </ConversationMessagesContextSet.Provider>
    </div>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  const userId = useContext(UserContext).user?.id;
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

  const userPic = useContext(UserContext).user?.profilePic;
  return (
    <div className={type}>
      <div className="">
        <Image
          className={`rounded-full ${
            type == "rcvMsg" ? "float-left" : "float-right"
          } mr-[10px] mt-[4px] border-[1.5px] border-[#202345]`}
          src={`${type == "rcvMsg" ? message.sender.profilePic : userPic}`}
          alt="profile pic"
          width={43}
          height={43}
        />
        <p className="ml-2 mt-12 mb-2 text-[#FFFFFF]"> {message.message} </p>
      </div>
    </div>
  );
};
const TypeMessage = ({
  maxId,
  setRefresh,
}: {
  maxId: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const setMessages = useContext(ConversationMessagesContextSet);
  const messages = useContext(ConversationMessagesContextStat);
  const conversation = useContext(LstConversationStateContext);
  const userId = useContext(UserContext).user?.id;

  const newMessage: MessageProps = {
    id: maxId + 1,
    message: inputValue,
    senderId: userId ?? "",
    conversationId: conversation?.id ?? "", // Provide a default value for conversationId
    createdAt: new Date(),
    sender: {
      profilePic: conversation?.profilePic ?? "",
      username: conversation?.name ?? "",
    },
    conversation: {
      type: conversation?.type ?? "",
      channel: {
        id: "",
        channelName: "",
        channelPic: "",
      },
    },
  };

  const sendMessage = () => {
    newMessage.message = inputValue;
    socket.emit("messageTo", {
      from: userId,
      conversationId: conversation?.id,
      message: inputValue,
    });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
    setRefresh((prev) => !prev);
  };

  const handlePressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      sendMessage();
      setInputValue("");
      setRefresh((prev) => !prev);
    }
  };
  
  const handleClick = () => {
    sendMessage();
    setInputValue("");
    setRefresh((prev) => !prev);
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
      <Image
        onClick={handleClick}
        className="sendIcon"
        src={sendIcon}
        alt="sendIcone"
        width={27}
        height={27}
      />
    </div>
  );
};
