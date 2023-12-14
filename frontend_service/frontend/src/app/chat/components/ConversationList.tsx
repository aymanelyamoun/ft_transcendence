import React, { use, useContext } from "react";
import { ConversationIthemProps } from "../../../../../../backend_service/backend/types/chatTypes";
import { useState, useEffect, createContext } from "react";
import Image from "next/image";
import msg from "../../../../public/msg_icon.png";
import msgs from "../../../../public/msgs_icons.png";
import msg2 from "../../../../public/msg2_icon.png";
import msgs2 from "../../../../public/msgs2_icons.png";
import avatar from "../../../../public/garou-kid.jpeg";
import splitBar from "../../../../public/splitBar.png";

import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { HiMiniChatBubbleLeft } from "react-icons/hi2";
import { Console } from "console";
import SearchBar from "./SearchBar";

export const IsChannelContext = createContext(false);

const ConversationIthem = (props: ConversationIthemProps) => {
  const conversationProps = props;
  // const { id, name, profilePic, type, createdAt, channelId, lastMessage } =
  props;

  const isChannel = useContext(IsChannelContext);
  // console.log("conversationp:", conversationProps);
  return (
    <li
      // key={props.id}
      className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
    >
      <Image
        className=" w-[49px] h-[49px] rounded-full"
        src={avatar}
        // src={conversationProps.profilePic}
        // alt={conversationProps.name}
        alt={conversationProps.name}
      />
      <div className="flex flex-col">
        <p className="friendsName">{conversationProps.name}</p>
        <p className="text-xs font-thin">{"tmp message hi"}</p>
      </div>
    </li>
  );
};

export const ConversationList = ({
  // rowData,
  conversation,
  setConversation,
}: {
  // rowData: Conversation[];
  conversation: ConversationIthemProps[];
  setConversation: React.Dispatch<
    React.SetStateAction<ConversationIthemProps[]>
  >;
}) => {
  // const [conversation, setConversation] = useState<Conversation[]>([]);

  // const userId = "0e1d8b57-aef4-45e6-9cf8-b834b87d0788";
  // const isAdmin = "false";

  // useEffect(() => {
  //   const fetchFun = async () => {
  //     const res = await fetch(
  //       `http://localhost:3001/api/channels/getUserConversationsDirect?userId=${userId}&isAdmin=${isAdmin}`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         return res.json();
  //         // const data: Conversation[];
  //       })
  //       .then((data) => {
  //         setConversation(data);
  //       });
  //   };
  //   fetchFun();
  // }, []);

  return (
    <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
      <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
        {conversation &&
          conversation.map((conv) => {
            // console.log(conv);
            return (
              <ConversationIthem
                key={conv.id}
                id={conv.id}
                name={conv.name}
                profilePic={conv.profilePic}
                type={conv.type}
                title="title"
                createdAt={conv.createdAt}
                channelId={conv.channelId}
                lastMessage={conv.lastMessage}
              />
            );
          })}
      </ul>
    </div>
  );
};

export const Conversations = ({ children }: { children: React.ReactNode }) => {
  const [isChannel, setIsChannel] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationIthemProps[]>(
    []
  );

  const userId = "1106e273-cd14-483c-8b3f-ec8076e413ad";
  const isAdmin = "false";

  const [rowData, setRowData] = useState<ConversationIthemProps[]>([]);

  useEffect(() => {
    const fetchFun = async () => {
      const res = await fetch(
        `http://localhost:3001/api/channels/getUserConversationsIthemList?userId=${userId}&isAdmin=${isAdmin}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
          // const data: Conversation[];
        })
        .then((data) => {
          setRowData(data);
          setConversation(data);
        });
    };
    fetchFun();
  }, []);

  // console.log(isChannel);
  return (
    <div className="friendList w-full mr-12 relative">
      <IsChannelContext.Provider value={isChannel}>
        <ChatToggel setIsChannel={setIsChannel} />
        <SearchBar
          rowData={rowData}
          conversation={conversation}
          setConversation={setConversation}
          // friendSearch={friendSearch}
          // setFriendSearch={setFriendSearch}
          // channelSearch={channelSearch}
          // setChannelSearch={setChannelSearch}
        />
        <ConversationList
          conversation={conversation}
          // rowData={rowData}
          setConversation={setConversation}
        />
        {/* {children} */}
      </IsChannelContext.Provider>
    </div>
  );
};

const ChatButton = ({
  onClick,
  children,
}: {
  onClick: any;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button onClick={onClick}>
        {children}
        {/* <Image src={imgUrl} alt={imgAlt} width={width} height={hight} /> */}
      </button>
    </>
  );
};

export const ChatToggel = ({
  setIsChannel,
}: {
  setIsChannel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isChannel = useContext(IsChannelContext);

  const handleChatClick = () => {
    setIsChannel(false);
  };

  const handleChannelClick = () => {
    setIsChannel(true);
  };

  return !isChannel ? (
    // add space-evenly using tailwindcss
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} />
      </ChatButton>

      <Image className="h-[20px] w-[1px]" src={splitBar} alt="splitBar"></Image>

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight
          size={22}
          color={`rgba(154, 155, 211, 0.5)`}
        />
      </ChatButton>
    </div>
  ) : (
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} color={`rgba(154, 155, 211, 0.5)`} />
      </ChatButton>

      <Image className="h-[20px] w-[1px]" src={splitBar} alt="splitBar"></Image>

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight size={22} />
      </ChatButton>
    </div>
  );
};

export default ConversationList;
